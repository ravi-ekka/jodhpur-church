package com.jodhpurchurch.app;

import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsController;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

public class MainActivity extends BridgeActivity {

    private FrameLayout rootLayout;
    private WebView webView;

    private FrameLayout overlay;
    private ProgressBar progressBar;
    private TextView messageText;
    private Button refreshButton;

    private ConnectivityManager connectivityManager;
    private ConnectivityManager.NetworkCallback networkCallback;

    private boolean pageLoaded = false;
    private boolean showingOffline = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        updateSystemBars();

        webView = getBridge().getWebView();

        if (webView != null) {
            setupOverlay();
            setupCapacitorWebViewListener();
            setupNetworkMonitoring();
        }
    }

    /**
     * Use Capacitor's existing BridgeWebViewClient.
     *
     * IMPORTANT:
     * Do NOT call webView.setWebViewClient().
     *
     * Capacitor 8.5.2 already has BridgeWebViewClient which handles:
     * - Capacitor navigation
     * - local server
     * - plugins
     * - WebView errors
     * - page events
     */
    private void setupCapacitorWebViewListener() {

        getBridge().addWebViewListener(new WebViewListener() {

            @Override
            public void onPageStarted(WebView view) {

                runOnUiThread(() -> {

                    pageLoaded = false;
                    showingOffline = false;

                    showLoading();
                });
            }

            @Override
            public void onPageLoaded(WebView view) {

                runOnUiThread(() -> {

                    pageLoaded = true;
                    showingOffline = false;

                    hideOverlay();
                });
            }

            @Override
            public void onReceivedError(WebView view) {

                runOnUiThread(() -> {

                    pageLoaded = false;
                    showingOffline = true;

                    showOffline();
                });
            }

            @Override
            public void onReceivedHttpError(WebView view) {

                /*
                 * HTTP errors such as 404/500 are not necessarily
                 * an internet connection problem.
                 *
                 * Therefore we only show the offline screen when
                 * Android reports that the device has no usable
                 * internet connection.
                 */
                runOnUiThread(() -> {

                    if (!hasInternetConnection()) {

                        pageLoaded = false;
                        showingOffline = true;

                        showOffline();
                    }
                });
            }

            @Override
            public void onPageCommitVisible(WebView view, String url) {

                runOnUiThread(() -> {

                    /*
                     * If a page has successfully committed, keep the
                     * loading screen until Capacitor reports onPageLoaded.
                     */
                });
            }
        });
    }

    private void setupOverlay() {

        if (webView == null) {
            return;
        }

        if (!(webView.getParent() instanceof FrameLayout)) {
            return;
        }

        rootLayout = (FrameLayout) webView.getParent();

        overlay = new FrameLayout(this);

        overlay.setClickable(true);
        overlay.setFocusable(true);

        FrameLayout.LayoutParams overlayParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                );

        rootLayout.addView(overlay, overlayParams);

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

        FrameLayout content = new FrameLayout(this);

        FrameLayout.LayoutParams contentParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                );

        overlay.addView(content, contentParams);

        FrameLayout center = new FrameLayout(this);

        FrameLayout.LayoutParams centerParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.WRAP_CONTENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT
                );

        centerParams.gravity = Gravity.CENTER;

        content.addView(center, centerParams);

        progressBar = new ProgressBar(this);

        progressBar.setIndeterminate(true);

        FrameLayout.LayoutParams progressParams =
                new FrameLayout.LayoutParams(
                        70,
                        70
                );

        progressParams.gravity = Gravity.CENTER_HORIZONTAL;

        center.addView(progressBar, progressParams);

        messageText = new TextView(this);

        messageText.setText("Loading...");
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

        messageText.setGravity(Gravity.CENTER);

        FrameLayout.LayoutParams textParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.WRAP_CONTENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT
                );

        textParams.gravity = Gravity.CENTER_HORIZONTAL;
        textParams.topMargin = 95;

        center.addView(messageText, textParams);

        refreshButton = new Button(this);

        refreshButton.setText("Refresh");
        refreshButton.setTextSize(16);

        refreshButton.setOnClickListener(v -> {

            if (hasInternetConnection()) {

                pageLoaded = false;
                showingOffline = false;

                showLoading();

                if (webView != null) {
                    webView.reload();
                }

            } else {

                showOffline();
            }
        });

        FrameLayout.LayoutParams buttonParams =
                new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.WRAP_CONTENT,
                        FrameLayout.LayoutParams.WRAP_CONTENT
                );

        buttonParams.gravity = Gravity.CENTER_HORIZONTAL;
        buttonParams.topMargin = 145;

        center.addView(refreshButton, buttonParams);
    }

    private void showLoading() {

        if (overlay == null) {
            return;
        }

        createLoadingView();

        if (progressBar != null) {
            progressBar.setVisibility(View.VISIBLE);
        }

        if (messageText != null) {
            messageText.setText("Loading...");
        }

        if (refreshButton != null) {
            refreshButton.setVisibility(View.GONE);
        }

        overlay.setVisibility(View.VISIBLE);
    }

    private void showOffline() {

        if (overlay == null) {
            return;
        }

        createLoadingView();

        if (progressBar != null) {
            progressBar.setVisibility(View.GONE);
        }

        if (messageText != null) {

            messageText.setText(
                    "No Internet Connection\n\n" +
                    "Please check your internet connection\n" +
                    "and try again."
            );

            messageText.setGravity(Gravity.CENTER);
        }

        if (refreshButton != null) {
            refreshButton.setVisibility(View.VISIBLE);
        }

        overlay.setVisibility(View.VISIBLE);
    }

    private void hideOverlay() {

        if (overlay != null) {
            overlay.setVisibility(View.GONE);
        }
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
                connectivityManager.getNetworkCapabilities(network);

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
                    public void onAvailable(Network network) {

                        runOnUiThread(() -> {

                            if (webView == null) {
                                return;
                            }

                            /*
                             * When internet returns, reload automatically.
                             */
                            if (!pageLoaded || showingOffline) {

                                pageLoaded = false;
                                showingOffline = false;

                                showLoading();

                                webView.reload();
                            }
                        });
                    }

                    @Override
                    public void onLost(Network network) {

                        runOnUiThread(() -> {

                            if (webView != null) {

                                pageLoaded = false;
                                showingOffline = true;

                                showOffline();
                            }
                        });
                    }
                };

        connectivityManager.registerDefaultNetworkCallback(
                networkCallback
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

        Window window = getWindow();

        boolean darkMode = isDarkMode();

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
                    .setSystemUiVisibility(flags);
        }
    }

    @Override
    public void onConfigurationChanged(
            Configuration newConfig
    ) {

        super.onConfigurationChanged(newConfig);

        updateSystemBars();

        /*
         * Rebuild the overlay only if it is currently visible.
         * This prevents losing the current page state.
         */
        if (overlay != null
                && overlay.getVisibility() == View.VISIBLE) {

            if (showingOffline) {
                showOffline();
            } else {
                showLoading();
            }
        }
    }

    @Override
    public void onBackPressed() {

        if (webView != null && webView.canGoBack()) {

            webView.goBack();

        } else {

            super.onBackPressed();
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

        super.onDestroy();
    }
}