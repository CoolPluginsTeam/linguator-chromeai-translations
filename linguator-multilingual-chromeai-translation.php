<?php
/**
 * Plugin Name:       Easy Web Translator – On-Device Chrome AI Translation
 * Plugin URI:        https://github.com/CoolPluginsTeam/linguator-chromeai-translations
 * Description:       Create a multilingual WordPress website in minutes with Easy Web Translator – On-Device Chrome AI Translation.
 * Version:           0.0.6
 * Requires at least: 6.2
 * Requires PHP:      7.2
 * Text Domain:       easy-web-translator
 * License:           GPL2
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Don't access directly.
}

use Linguator\Includes\Core\Linguator;



define( 'LINGUATOR_VERSION', '0.0.6' );
define( 'LMAT_MIN_WP_VERSION', '6.2' );
define( 'LMAT_MIN_PHP_VERSION', '7.2' );
define( 'LINGUATOR_FILE', __FILE__ ); 
define( 'LINGUATOR_DIR', __DIR__ );
define('LINGUATOR_URL', plugin_dir_url(LINGUATOR_FILE));

// Whether we are using Linguator, get the filename of the plugin in use.
if ( ! defined( 'LINGUATOR_ROOT_FILE' ) ) {
	define( 'LINGUATOR_ROOT_FILE', __FILE__ );
}

if ( ! defined( 'LINGUATOR_BASENAME' ) ) {
	define( 'LINGUATOR_BASENAME', plugin_basename( __FILE__ ) ); // Plugin name as known by WP.
	require __DIR__ . '/vendor/autoload.php';
}

define( 'LINGUATOR', ucwords( str_replace( '-', ' ', dirname( LINGUATOR_BASENAME ) ) ) );

// Create installer instance
$installer = new \Linguator\Install\LMAT_Install( LINGUATOR_BASENAME );

// Register activation/deactivation hooks
register_activation_hook( __FILE__, array( $installer, 'activate' ) );
register_deactivation_hook( __FILE__, array( $installer, 'deactivate' ) );

// Initialize the plugin
if ( empty( $_GET['deactivate-linguator'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
	new Linguator();
}

// Handle redirect after activation and language switcher visibility
add_action('admin_init', function() {
	// Don't redirect to wizard if Polylang is detected
	if ( defined( 'POLYLANG_VERSION' ) ) {
		return;
	}
	
	// Only check setup flag on plugins page to avoid unnecessary database queries
	$is_plugins_page = false;
	if ( isset( $_SERVER['REQUEST_URI'] ) && strpos( $_SERVER['REQUEST_URI'], 'plugins.php' ) !== false ) {
		$is_plugins_page = true;
	}
	// Only run on plugins page
	if ( $is_plugins_page ) {
		// Only proceed if we need setup and are in admin
		if (get_option('lmat_needs_setup') === 'yes' && is_admin()) {
			if (!is_network_admin() && !isset($_GET['activate-multi'])) {
				// Remove the setup flag
				delete_option('lmat_needs_setup');
				// Redirect to the setup wizard
				wp_safe_redirect(admin_url('admin.php?page=lmat_wizard'));
				exit;
			}
		}
	}
	
	// Ensure language switcher is visible on nav-menus page for new installations
	$install_date = get_option('lmat_install_date');
	
	if ($install_date) {
		// Check if this is a recent installation (within last 24 hours)
		$install_timestamp = strtotime($install_date);
		$time_since_install = time() - $install_timestamp;
		
		// If installed within last 24 hours, ensure language switcher is visible
		if ($time_since_install <= 86400) {
			// Hook into nav-menus page load
			add_action('load-nav-menus.php', function() {
				$user_id = get_current_user_id();
				if (!$user_id) {
					return;
				}
				
				// Get hidden meta boxes for current user
				$hidden_meta_boxes = get_user_meta($user_id, 'metaboxhidden_nav-menus', true);
				
				// Initialize as empty array if not set
				if (!is_array($hidden_meta_boxes)) {
					$hidden_meta_boxes = array();
				}
				
				// Remove language switcher from hidden meta boxes to make it visible
				$hidden_meta_boxes = array_diff($hidden_meta_boxes, array('lmat_lang_switch_box'));
				
				// Update user meta
				update_user_meta($user_id, 'metaboxhidden_nav-menus', $hidden_meta_boxes);
			});
		}
	}
});
