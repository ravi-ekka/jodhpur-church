package com.jodhpurchurch.app;

import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsController;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {

    private WebView webView;

    private FrameLayout overlay;
    private ProgressBar progressBar;
    private TextView messageText;
    private Button refreshButton;

    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;

    private boolean pageLoaded = false;
    private boolean showingOffline = false;
    private boolean retrying = false;

    /*
     * --------------------------------------------------------
     * ANDROID NAVIGATION HISTORY
     * --------------------------------------------------------
     *
     * We maintain our own history because the website uses
     * Next.js App Router client-side navigation.
     */
    private final Handler navigationHandler =
            new Handler(Looper.getMainLooper());

    private final List<String> navigationHistory =
            new ArrayList<>();

    private String lastKnownUrl = null;

    /*
     * True while Android is intentionally navigating backward.
     *
     * This prevents the URL tracker from adding the previous
     * page as a new forward-history entry.
     */
    private boolean handlingBackNavigation = false;

    /*
     * Poll the current URL so we can detect Next.js client-side
     * navigation such as <Link href="...">.
     */
    private final Runnable navigationTracker =
            new Runnable() {

                @Override
                public void run() {

                    if (webView == null
                            || isFinishing()
                            || isDestroyed()) {
                        return;
                    }

                    webView.evaluateJavascript(
                            "(function(){return window.location.href;})()",
                            value -> {

                                if (value == null) {
                                    return;
                                }

                                String url =
                                        cleanJavascriptString(value);

                                if (url == null
                                        || url.isEmpty()
                                        || "null".equals(url)) {
                                    return;
                                }

                                /*
                                 * Ignore the same URL.
                                 */
                                if (url.equals(lastKnownUrl)) {
                                    return;
                                }

                                lastKnownUrl = url;

                                /*
                                 * When Android Back is navigating to
                                 * an already-known previous page, do
                                 * not add it again.
                                 */
                                if (handlingBackNavigation) {
                                    return;
                                }

                                /*
                                 * Add only a genuinely new route.
                                 */
                                if (navigationHistory.isEmpty()
                                        || !navigationHistory
                                        .get(navigationHistory.size() - 1)
                                        .equals(url)) {

                                    navigationHistory.add(url);
                                }
                            }
                    );

                    navigationHandler.postDelayed(
                            this,
                            200
                    );
                }
            };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        updateSystemBars();

        webView = getBridge().getWebView();

        if (webView != null) {

            setupOverlay();

            setupCapacitorWebViewListener();

            setupNetworkMonitoring();

            setupBackNavigation();

            startNavigationTracking();
        }
    }

    /**
     * Convert the value returned by evaluateJavascript()
     * into a normal Java String.
     */
    private String cleanJavascriptString(String value) {

        if (value == null) {
            return null;
        }

        String result = value.trim();

        /*
         * evaluateJavascript returns a JSON string such as:
         *
         * "https://example.com/en/about"
         *
         * Remove the surrounding quotes.
         */
        if (result.length() >= 2
                && result.startsWith("\"")
                && result.endsWith("\"")) {

            result = result.substring(
                    1,
                    result.length() - 1
            );

            /*
             * Decode common JSON escaping.
             */
            result = result
                    .replace("\\/", "/")
                    .replace("\\\"", "\"")
                    .replace("\\\\", "\\");
        }

        return result;
    }

    /**
     * Start monitoring the actual URL used by the Next.js app.
     */
    private void startNavigationTracking() {

        navigationHandler.removeCallbacks(
                navigationTracker
        );

        navigationHandler.post(
                navigationTracker
        );
    }

    /**
     * Keep Capacitor's own BridgeWebViewClient.
     *
     * We only listen to its events.
     */
    private void setupCapacitorWebViewListener() {

        getBridge().addWebViewListener(
                new WebViewListener() {

                    @Override
                    public void onPageStarted(
                            WebView view
                    ) {

                        runOnUiThread(() -> {

                            pageLoaded = false;
                            showingOffline = false;
                            retrying = false;

                            showLoading();
                        });
                    }

                    @Override
                    public void onPageLoaded(
                            WebView view
                    ) {

                        runOnUiThread(() -> {

                            pageLoaded = true;
                            showingOffline = false;
                            retrying = false;

                            hideOverlay();
                        });
                    }

                    @Override
                    public void onReceivedError(
                            WebView view
                    ) {

                        runOnUiThread(() -> {

                            pageLoaded = false;
                            showingOffline = true;
                            retrying = false;

                            showOffline();
                        });
                    }

                    @Override
                    public void onReceivedHttpError(
                            WebView view
                    ) {

                        runOnUiThread(() -> {

                            /*
                             * Only treat an HTTP error as an offline
                             * condition when there is actually no
                             * validated internet connection.
                             */
                            if (!hasInternetConnection()) {

                                pageLoaded = false;
                                showingOffline = true;
                                retrying = false;

                                showOffline();
                            }
                        });
                    }

                    @Override
                    public void onPageCommitVisible(
                            WebView view,
                            String url
                    ) {
                        // Capacitor page is becoming visible.
                    }
                }
        );
    }

    /**
     * Put the overlay directly on the Activity content.
     *
     * This avoids depending on the WebView's parent layout.
     */
    private void setupOverlay() {

        overlay = new FrameLayout(this);

        overlay.setClickable(true);
        overlay.setFocusable(true);

        FrameLayout.LayoutParams params =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                );

        addContentView(
                overlay,
                params
        );

        createLoadingView();

        showLoading();
    }

    private void createLoadingView() {

        if (overlay == null) {
            return;
        }

        overlay.removeAllViews();

        boolean darkMode = isDarkMode();

        overlay.setBackgroundColor(
                darkMode
                        ? Color.rgb(18, 18, 18)
                        : Color.WHITE
        );

        FrameLayout content =
                new FrameLayout(this);

        FrameLayout.LayoutParams contentParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                );

        overlay.addView(
                content,
                contentParams
        );

        FrameLayout center =
                new FrameLayout(this);

        FrameLayout.LayoutParams centerParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.WRAP_CONTENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT
                );

        centerParams.gravity =
                Gravity.CENTER;

        content.addView(
                center,
                centerParams
        );

        progressBar =
                new ProgressBar(this);

        progressBar.setIndeterminate(true);

        FrameLayout.LayoutParams progressParams =
                new FrameLayout.LayoutParams(
                        70,
                        70
                );

        progressParams.gravity =
                Gravity.CENTER_HORIZONTAL;

        center.addView(
                progressBar,
                progressParams
        );

        messageText =
                new TextView(this);

        messageText.setText(
                "Loading..."
        );

        messageText.setTextSize(18);

        messageText.setTypeface(
                Typeface.create(
                        Typeface.DEFAULT,
                        Typeface.NORMAL
                )
        );

        messageText.setTextColor(
                darkMode
                        ? Color.WHITE
                        : Color.rgb(50, 50, 50)
        );

        messageText.setGravity(
                Gravity.CENTER
        );

        FrameLayout.LayoutParams textParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.WRAP_CONTENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT
                );

        textParams.gravity =
                Gravity.CENTER_HORIZONTAL;

        textParams.topMargin = 95;

        center.addView(
                messageText,
                textParams
        );

        refreshButton =
                new Button(this);

        refreshButton.setText(
                "Refresh"
        );

        refreshButton.setTextSize(16);

        refreshButton.setOnClickListener(v -> {

            if (hasInternetConnection()) {

                retryWebView();

            } else {

                showOffline();
            }
        });

        FrameLayout.LayoutParams buttonParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.WRAP_CONTENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT
                );

        buttonParams.gravity =
                Gravity.CENTER_HORIZONTAL;

        buttonParams.topMargin = 145;

        center.addView(
                refreshButton,
                buttonParams
        );
    }

    private void showLoading() {

        if (overlay == null) {
            return;
        }

        createLoadingView();

        progressBar.setVisibility(
                View.VISIBLE
        );

        messageText.setText(
                "Loading..."
        );

        refreshButton.setVisibility(
                View.GONE
        );

        overlay.setVisibility(
                View.VISIBLE
        );

        overlay.bringToFront();
    }

    private void showOffline() {

        if (overlay == null) {
            return;
        }

        createLoadingView();

        progressBar.setVisibility(
                View.GONE
        );

        messageText.setText(
                "No Internet Connection\n\n"
                        + "Please check your internet connection\n"
                        + "and try again."
        );

        messageText.setGravity(
                Gravity.CENTER
        );

        refreshButton.setVisibility(
                View.VISIBLE
        );

        overlay.setVisibility(
                View.VISIBLE
        );

        overlay.bringToFront();
    }

    private void hideOverlay() {

        if (overlay != null) {

            overlay.setVisibility(
                    View.GONE
            );
        }
    }

    private void retryWebView() {

        if (webView == null
                || retrying) {
            return;
        }

        retrying = true;

        pageLoaded = false;

        showingOffline = false;

        showLoading();

        webView.postDelayed(
                () -> {

                    if (webView != null) {
                        webView.reload();
                    }

                },
                150
        );
    }

    private boolean hasInternetConnection() {

        if (connectivityManager == null) {

            connectivityManager =
                    (ConnectivityManager)
                            getSystemService(
                                    Context.CONNECTIVITY_SERVICE
                            );
        }

        if (connectivityManager == null) {
            return false;
        }

        Network network =
                connectivityManager.getActiveNetwork();

        if (network == null) {
            return false;
        }

        NetworkCapabilities capabilities =
                connectivityManager.getNetworkCapabilities(
                        network
                );

        return capabilities != null
                && capabilities.hasCapability(
                        NetworkCapabilities.NET_CAPABILITY_INTERNET
                )
                && capabilities.hasCapability(
                        NetworkCapabilities.NET_CAPABILITY_VALIDATED
                );
    }

    private void setupNetworkMonitoring() {

        connectivityManager =
                (ConnectivityManager)
                        getSystemService(
                                Context.CONNECTIVITY_SERVICE
                        );

        if (connectivityManager == null) {
            return;
        }

        networkCallback =
                new ConnectivityManager.NetworkCallback() {

                    @Override
                    public void onAvailable(
                            Network network
                    ) {

                        runOnUiThread(() -> {

                            if (webView == null) {
                                return;
                            }

                            /*
                             * Internet has returned.
                             */
                            if (!pageLoaded
                                    || showingOffline) {

                                retryWebView();
                            }
                        });
                    }

                    @Override
                    public void onLost(
                            Network network
                    ) {

                        runOnUiThread(() -> {

                            pageLoaded = false;

                            showingOffline = true;

                            retrying = false;

                            showOffline();
                        });
                    }
                };

        connectivityManager.registerDefaultNetworkCallback(
                networkCallback
        );
    }


   /**
 * Android Back navigation.
 *
 * Uses the WebView's actual navigation history.
 *
 * Example:
 *
 * Home → About → Events
 *
 * Back → About
 * Back → Home
 * Back → close app
 */
private void setupBackNavigation() {

    getOnBackPressedDispatcher().addCallback(
            this,
            new OnBackPressedCallback(true) {

                @Override
                public void handleOnBackPressed() {

                    if (webView == null) {
                        finish();
                        return;
                    }

                    String currentUrl = webView.getUrl();

                    if (currentUrl == null) {
                        finish();
                        return;
                    }

                    /*
                     * If WebView has browser history,
                     * go to the previous page.
                     */
                    if (webView.canGoBack()) {

                        webView.goBack();

                        return;
                    }

                    /*
                     * No WebView history left.
                     *
                     * Check whether we are already on Home.
                     */
                    boolean isHome =
                            currentUrl.endsWith("/en") ||
                            currentUrl.endsWith("/en/") ||
                            currentUrl.endsWith("/hi") ||
                            currentUrl.endsWith("/hi/") ||
                            currentUrl.endsWith("/kru") ||
                            currentUrl.endsWith("/kru/");

                    if (isHome) {

                        // Already on Home → close app
                        finish();

                    } else {

                        // Not Home → go to Home
                        String homeUrl =
                                currentUrl.replaceFirst(
                                        "/(en|hi|kru)(/.*)?/?$",
                                        "/$1"
                                );

                        webView.loadUrl(homeUrl);
                    }
                }
            }
    );
}

    private boolean isDarkMode() {

        int mode =
                getResources()
                        .getConfiguration()
                        .uiMode
                        & Configuration.UI_MODE_NIGHT_MASK;

        return mode ==
                Configuration.UI_MODE_NIGHT_YES;
    }

    private void updateSystemBars() {

        Window window =
                getWindow();

        boolean darkMode =
                isDarkMode();

        if (android.os.Build.VERSION.SDK_INT >=
                android.os.Build.VERSION_CODES.R) {

            WindowInsetsController controller =
                    window.getInsetsController();

            if (controller != null) {

                int appearance = 0;

                if (!darkMode) {

                    appearance =
                            WindowInsetsController
                                    .APPEARANCE_LIGHT_STATUS_BARS
                            |
                            WindowInsetsController
                                    .APPEARANCE_LIGHT_NAVIGATION_BARS;
                }

                controller.setSystemBarsAppearance(
                        appearance,
                        WindowInsetsController
                                .APPEARANCE_LIGHT_STATUS_BARS
                        |
                        WindowInsetsController
                                .APPEARANCE_LIGHT_NAVIGATION_BARS
                );
            }

        } else {

            int flags =
                    window.getDecorView()
                            .getSystemUiVisibility();

            if (darkMode) {

                flags &= ~(
                        View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                        |
                        View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
                );

            } else {

                flags |=
                        View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                        |
                        View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            }

            window.getDecorView()
                    .setSystemUiVisibility(
                            flags
                    );
        }
    }

    @Override
    public void onConfigurationChanged(
            Configuration newConfig
    ) {

        super.onConfigurationChanged(
                newConfig
        );

        updateSystemBars();

        if (overlay != null
                && overlay.getVisibility()
                == View.VISIBLE) {

            if (showingOffline) {

                showOffline();

            } else {

                showLoading();
            }
        }
    }

    @Override
    public void onDestroy() {

        if (connectivityManager != null
                && networkCallback != null) {

            try {

                connectivityManager.unregisterNetworkCallback(
                        networkCallback
                );

            } catch (Exception ignored) {
            }
        }

        navigationHandler.removeCallbacksAndMessages(
                null
        );

        super.onDestroy();
    }
}