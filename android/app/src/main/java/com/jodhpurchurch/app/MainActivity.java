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
         */
        private final Handler navigationHandler =
                        new Handler(Looper.getMainLooper());

        private final List<String> navigationHistory =
                        new ArrayList<>();

        private String lastKnownUrl = null;

        /*
         * Current theme reported by the WEBSITE.
         *
         * true  = website dark mode
         * false = website light mode
         */
        private boolean lastKnownWebsiteDarkMode = false;

        /*
         * True while Android is intentionally navigating backward.
         */
        private boolean handlingBackNavigation = false;

        /*
         * Poll the current URL and website theme.
         */
        private final Runnable navigationTracker = new Runnable() {

                @Override
                public void run() {

                        if (webView == null
                                        || isFinishing()
                                        || isDestroyed()) {
                                return;
                        }

                        // -------------------------------------------------
                        // CHECK CURRENT WEBSITE URL
                        // -------------------------------------------------

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

                                                if (url.equals(lastKnownUrl)) {
                                                        return;
                                                }

                                                lastKnownUrl = url;

                                                if (handlingBackNavigation) {
                                                        return;
                                                }

                                                if (navigationHistory.isEmpty()
                                                                || !navigationHistory
                                                                                .get(navigationHistory.size() - 1)
                                                                                .equals(url)) {

                                                        navigationHistory.add(url);
                                                }
                                        });

                        // -------------------------------------------------
                        // CHECK WEBSITE DARK / LIGHT MODE
                        // -------------------------------------------------

                        webView.evaluateJavascript(
                                        "(function() {" +
                                                        "return document.documentElement.classList.contains('dark');" +
                                                        "})()",
                                        value -> {

                                                boolean websiteDarkMode =
                                                                "true".equals(value);

                                                if (websiteDarkMode
                                                                != lastKnownWebsiteDarkMode) {

                                                        lastKnownWebsiteDarkMode =
                                                                        websiteDarkMode;

                                                        updateSystemBars(
                                                                        websiteDarkMode);

                                                        /*
                                                         * Rebuild overlay using
                                                         * the new website theme.
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
                                        });

                        navigationHandler.postDelayed(
                                        this,
                                        200);
                }
        };

        @Override
        public void onCreate(Bundle savedInstanceState) {

                super.onCreate(savedInstanceState);

                /*
                 * Get Capacitor WebView.
                 */
                webView = getBridge().getWebView();

                if (webView != null) {

                        /*
                         * Start with light system bars.
                         *
                         * updateWebsiteTheme() will immediately
                         * change them if the website is dark.
                         */
                        updateSystemBars(false);

                        setupOverlay();

                        setupCapacitorWebViewListener();

                        setupNetworkMonitoring();

                        setupBackNavigation();

                        startNavigationTracking();

                        /*
                         * Read website's actual theme.
                         */
                        updateWebsiteTheme();

                        /*
                         * Check internet immediately.
                         */
                        if (!hasInternetConnection()) {

                                pageLoaded = false;
                                showingOffline = true;
                                retrying = false;

                                showOffline();
                        }
                }
        }

        /**
         * Convert evaluateJavascript() result into
         * a normal Java String.
         */
        private String cleanJavascriptString(String value) {

                if (value == null) {
                        return null;
                }

                String result = value.trim();

                if (result.length() >= 2
                                && result.startsWith("\"")
                                && result.endsWith("\"")) {

                        result = result.substring(
                                        1,
                                        result.length() - 1);

                        result = result
                                        .replace("\\/", "/")
                                        .replace("\\\"", "\"")
                                        .replace("\\\\", "\\");
                }

                return result;
        }

        /**
         * Start monitoring URL and website theme.
         */
        private void startNavigationTracking() {

                navigationHandler.removeCallbacks(
                                navigationTracker);

                navigationHandler.post(
                                navigationTracker);
        }

        /**
         * Keep Capacitor's own WebViewClient.
         */
        private void setupCapacitorWebViewListener() {

                getBridge().addWebViewListener(
                                new WebViewListener() {

                                        @Override
                                        public void onPageStarted(
                                                        WebView view) {

                                                runOnUiThread(() -> {

                                                        pageLoaded = false;
                                                        showingOffline = false;
                                                        retrying = false;

                                                        showLoading();
                                                });
                                        }

                                        @Override
                                        public void onPageLoaded(
                                                        WebView view) {

                                                runOnUiThread(() -> {

                                                        pageLoaded = true;
                                                        showingOffline = false;
                                                        retrying = false;

                                                        hideOverlay();

                                                        /*
                                                         * Read website theme
                                                         * after loading.
                                                         */
                                                        updateWebsiteTheme();
                                                });
                                        }

                                        @Override
                                        public void onReceivedError(
                                                        WebView view) {

                                                runOnUiThread(() -> {

                                                        pageLoaded = false;
                                                        showingOffline = true;
                                                        retrying = false;

                                                        showOffline();
                                                });
                                        }

                                        @Override
                                        public void onReceivedHttpError(
                                                        WebView view) {

                                                runOnUiThread(() -> {

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
                                                        String url) {

                                                // Capacitor page becoming visible.
                                        }
                                });
        }

        /**
         * Put overlay directly on Activity content.
         */
        private void setupOverlay() {

                overlay = new FrameLayout(this);

                overlay.setClickable(true);
                overlay.setFocusable(true);

                FrameLayout.LayoutParams params =
                                new FrameLayout.LayoutParams(
                                                FrameLayout.LayoutParams.MATCH_PARENT,
                                                FrameLayout.LayoutParams.MATCH_PARENT);

                addContentView(
                                overlay,
                                params);

                createLoadingView();

                showLoading();
        }

        private void createLoadingView() {

                if (overlay == null) {
                        return;
                }

                overlay.removeAllViews();

                /*
                 * Use WEBSITE theme.
                 */
                boolean darkMode =
                                lastKnownWebsiteDarkMode;

                overlay.setBackgroundColor(
                                darkMode
                                                ? Color.rgb(15, 15, 15)
                                                : Color.WHITE);

                FrameLayout content =
                                new FrameLayout(this);

                FrameLayout.LayoutParams contentParams =
                                new FrameLayout.LayoutParams(
                                                FrameLayout.LayoutParams.MATCH_PARENT,
                                                FrameLayout.LayoutParams.MATCH_PARENT);

                overlay.addView(
                                content,
                                contentParams);

                FrameLayout center =
                                new FrameLayout(this);

                FrameLayout.LayoutParams centerParams =
                                new FrameLayout.LayoutParams(
                                                FrameLayout.LayoutParams.WRAP_CONTENT,
                                                FrameLayout.LayoutParams.WRAP_CONTENT);

                centerParams.gravity = Gravity.CENTER;

                content.addView(
                                center,
                                centerParams);

                progressBar =
                                new ProgressBar(this);

                progressBar.setIndeterminate(true);

                FrameLayout.LayoutParams progressParams =
                                new FrameLayout.LayoutParams(
                                                70,
                                                70);

                progressParams.gravity =
                                Gravity.CENTER_HORIZONTAL;

                center.addView(
                                progressBar,
                                progressParams);

                messageText =
                                new TextView(this);

                messageText.setText(
                                "Loading...");

                messageText.setTextSize(18);

                messageText.setTypeface(
                                Typeface.create(
                                                Typeface.DEFAULT,
                                                Typeface.NORMAL));

                messageText.setTextColor(
                                darkMode
                                                ? Color.WHITE
                                                : Color.rgb(50, 50, 50));

                messageText.setGravity(
                                Gravity.CENTER);

                FrameLayout.LayoutParams textParams =
                                new FrameLayout.LayoutParams(
                                                FrameLayout.LayoutParams.WRAP_CONTENT,
                                                FrameLayout.LayoutParams.WRAP_CONTENT);

                textParams.gravity =
                                Gravity.CENTER_HORIZONTAL;

                textParams.topMargin = 95;

                center.addView(
                                messageText,
                                textParams);

                refreshButton =
                                new Button(this);

                refreshButton.setText(
                                "Refresh");

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
                                                FrameLayout.LayoutParams.WRAP_CONTENT);

                buttonParams.gravity =
                                Gravity.CENTER_HORIZONTAL;

                buttonParams.topMargin = 145;

                center.addView(
                                refreshButton,
                                buttonParams);
        }

        private void showLoading() {

                if (overlay == null) {
                        return;
                }

                createLoadingView();

                progressBar.setVisibility(
                                View.VISIBLE);

                messageText.setText(
                                "Loading...");

                refreshButton.setVisibility(
                                View.GONE);

                overlay.setVisibility(
                                View.VISIBLE);

                overlay.bringToFront();
        }

        private void showOffline() {

                if (overlay == null) {
                        return;
                }

                createLoadingView();

                progressBar.setVisibility(
                                View.GONE);

                messageText.setText(
                                "No Internet Connection\n\n"
                                                + "Please check your internet connection\n"
                                                + "and try again.");

                messageText.setGravity(
                                Gravity.CENTER);

                refreshButton.setVisibility(
                                View.VISIBLE);

                overlay.setVisibility(
                                View.VISIBLE);

                overlay.bringToFront();
        }

        private void hideOverlay() {

                if (overlay != null) {

                        overlay.setVisibility(
                                        View.GONE);
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
                                150);
        }

        private boolean hasInternetConnection() {

                if (connectivityManager == null) {

                        connectivityManager =
                                        (ConnectivityManager)
                                                        getSystemService(
                                                                        Context.CONNECTIVITY_SERVICE);
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
                                                network);

                return capabilities != null
                                && capabilities.hasCapability(
                                                NetworkCapabilities.NET_CAPABILITY_INTERNET)
                                && capabilities.hasCapability(
                                                NetworkCapabilities.NET_CAPABILITY_VALIDATED);
        }

        private void setupNetworkMonitoring() {

                connectivityManager =
                                (ConnectivityManager)
                                                getSystemService(
                                                                Context.CONNECTIVITY_SERVICE);

                if (connectivityManager == null) {
                        return;
                }

                networkCallback =
                                new ConnectivityManager.NetworkCallback() {

                                        @Override
                                        public void onAvailable(
                                                        Network network) {

                                                runOnUiThread(() -> {

                                                        if (webView == null) {
                                                                return;
                                                        }

                                                        navigationHandler.postDelayed(
                                                                        () -> {

                                                                                if (webView == null) {
                                                                                        return;
                                                                                }

                                                                                if (hasInternetConnection()) {

                                                                                        if (!pageLoaded
                                                                                                        || showingOffline) {

                                                                                                retryWebView();
                                                                                        }
                                                                                }

                                                                        },
                                                                        500);
                                                });
                                        }

                                        @Override
                                        public void onLost(
                                                        Network network) {

                                                runOnUiThread(() -> {

                                                        navigationHandler.postDelayed(
                                                                        () -> {

                                                                                if (webView == null) {
                                                                                        return;
                                                                                }

                                                                                if (!hasInternetConnection()) {

                                                                                        pageLoaded = false;
                                                                                        showingOffline = true;
                                                                                        retrying = false;

                                                                                        showOffline();
                                                                                }

                                                                        },
                                                                        500);
                                                });
                                        }
                                };

                connectivityManager.registerDefaultNetworkCallback(
                                networkCallback);
        }

        /**
         * Android Back navigation.
         *
         * DO NOT CHANGE.
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

                                                String currentUrl =
                                                                webView.getUrl();

                                                if (currentUrl == null) {
                                                        finish();
                                                        return;
                                                }

                                                if (webView.canGoBack()) {

                                                        webView.goBack();

                                                        return;
                                                }

                                                boolean isHome =
                                                                currentUrl.endsWith("/en")
                                                                                ||
                                                                currentUrl.endsWith("/en/")
                                                                                ||
                                                                currentUrl.endsWith("/hi")
                                                                                ||
                                                                currentUrl.endsWith("/hi/")
                                                                                ||
                                                                currentUrl.endsWith("/kru")
                                                                                ||
                                                                currentUrl.endsWith("/kru/");

                                                if (isHome) {

                                                        finish();

                                                } else {

                                                        String homeUrl =
                                                                        currentUrl.replaceFirst(
                                                                                        "/(en|hi|kru)(/.*)?/?$",
                                                                                        "/$1");

                                                        webView.loadUrl(
                                                                        homeUrl);
                                                }
                                        }
                                });
        }

        /**
         * Read CURRENT theme from WEBSITE.
         */
        private void updateWebsiteTheme() {

                if (webView == null) {
                        return;
                }

                webView.evaluateJavascript(
                                "(function() {" +
                                                "return document.documentElement.classList.contains('dark');" +
                                                "})()",
                                value -> {

                                        boolean darkMode =
                                                        "true".equals(value);

                                        lastKnownWebsiteDarkMode =
                                                        darkMode;

                                        updateSystemBars(
                                                        darkMode);
                                });
        }

        /**
         * Update Android system bars according to WEBSITE theme.
         *
         * WEBSITE LIGHT:
         * Status bar      = #ffffff
         * Navigation bar  = #ffffff
         * Icons           = dark
         *
         * WEBSITE DARK:
         * Status bar      = #0f0f0f
         * Navigation bar  = #0f0f0f
         * Icons           = white
         */
        private void updateSystemBars(
                        boolean darkMode) {

                Window window = getWindow();

                /*
                 * -------------------------------------------------
                 * SYSTEM BAR BACKGROUND
                 * -------------------------------------------------
                 *
                 * Match website theme.
                 */
                int backgroundColor =
                                darkMode
                                                ? Color.rgb(15, 15, 15)
                                                : Color.WHITE;

                window.setStatusBarColor(
                                backgroundColor);

                window.setNavigationBarColor(
                                backgroundColor);

                /*
                 * -------------------------------------------------
                 * DISABLE ANDROID CONTRAST SCRIM
                 * -------------------------------------------------
                 */
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {

                        window.setStatusBarContrastEnforced(
                                        false);

                        window.setNavigationBarContrastEnforced(
                                        false);
                }

                /*
                 * -------------------------------------------------
                 * SYSTEM BAR ICON COLORS
                 * -------------------------------------------------
                 *
                 * DARK MODE:
                 *     no LIGHT flags
                 *     = white icons
                 *
                 * LIGHT MODE:
                 *     LIGHT flags
                 *     = dark icons
                 * -------------------------------------------------
                 */
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {

                        WindowInsetsController controller =
                                        window.getInsetsController();

                        if (controller != null) {

                                int appearance = 0;

                                if (!darkMode) {

                                        appearance =
                                                        WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                                                                        |
                                                        WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                                }

                                controller.setSystemBarsAppearance(
                                                appearance,

                                                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                                                                |
                                                WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
                        }

                } else {

                        /*
                         * Older Android versions.
                         */
                        View decorView =
                                        window.getDecorView();

                        int flags =
                                        decorView.getSystemUiVisibility();

                        if (darkMode) {

                                /*
                                 * Dark background:
                                 * WHITE icons.
                                 */
                                flags &= ~(
                                                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                                                                |
                                                View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);

                        } else {

                                /*
                                 * Light background:
                                 * DARK icons.
                                 */
                                flags |=
                                                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
                                                                |
                                                View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                        }

                        decorView.setSystemUiVisibility(
                                        flags);
                }
        }

        @Override
        public void onConfigurationChanged(
                        Configuration newConfig) {

                super.onConfigurationChanged(
                                newConfig);

                /*
                 * Do NOT use Android's system theme.
                 *
                 * Use website theme instead.
                 */
                updateWebsiteTheme();

                /*
                 * Rebuild overlay using website theme.
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
        public void onDestroy() {

                if (connectivityManager != null
                                && networkCallback != null) {

                        try {

                                connectivityManager.unregisterNetworkCallback(
                                                networkCallback);

                        } catch (Exception ignored) {
                        }
                }

                navigationHandler.removeCallbacksAndMessages(
                                null);

                super.onDestroy();
        }
}