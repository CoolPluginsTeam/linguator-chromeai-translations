<?php
/**
 * @package Linguator
 */

namespace Linguator\Modules\sync;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Linguator\Settings\Controllers\LMAT_Settings_Module;



/**
 * Settings class for synchronization settings management
 *
 *  
 */
class LMAT_Settings_Sync extends LMAT_Settings_Module {
	/**
	 * Stores the display order priority.
	 *
	 * @var int
	 */
	public $priority = 50;

	/**
	 * Constructor
	 *
	 *  
	 *
	 * @param object $linguator The linguator object.
	 */
	public function __construct( &$linguator ) {
		parent::__construct(
			$linguator,
			array(
				'module'      => 'sync',
				'title'       => __( 'Synchronization', 'easy-web-translator' ),
				'description' => __( 'The synchronization options allow to maintain exact same values (or translations in the case of taxonomies and page parent) of meta content between the translations of a post or page.', 'easy-web-translator' ),
			)
		);
	}

	/**
	 * Deactivates the module
	 *
	 *  
	 */
	public function deactivate() {
		$this->options['sync'] = array();
	}


	/**
	 * Prepare the received data before saving.
	 *
	 *  
	 *
	 * @param array $options Raw values to save.
	 * @return array
	 */
	protected function prepare_raw_data( array $options ): array {
		// Take care to return only validated options.
		return array( 'sync' => empty( $options['sync'] ) ? array() : array_keys( $options['sync'], 1 ) );
	}

	/**
	 * Get the row actions.
	 *
	 *  
	 *
	 * @return string[] Row actions.
	 */
	protected function get_actions() {
		return empty( $this->options['sync'] ) ? array( 'configure' ) : array( 'configure', 'deactivate' );
	}

	/**
	 * Get the list of synchronization settings.
	 *
	 *  
	 *
	 * @return string[] Array synchronization options.
	 *
	 * @phpstan-return non-empty-array<non-falsy-string, string>
	 */
	public static function list_metas_to_sync() {
		return array(
			'taxonomies'        => __( 'Taxonomies', 'easy-web-translator' ),
			'post_meta'         => __( 'Custom fields', 'easy-web-translator' ),
			'comment_status'    => __( 'Comment status', 'easy-web-translator' ),
			'ping_status'       => __( 'Ping status', 'easy-web-translator' ),
			'sticky_posts'      => __( 'Sticky posts', 'easy-web-translator' ),
			'post_date'         => __( 'Published date', 'easy-web-translator' ),
			'post_format'       => __( 'Post format', 'easy-web-translator' ),
			'post_parent'       => __( 'Page parent', 'easy-web-translator' ),
			'_wp_page_template' => __( 'Page template', 'easy-web-translator' ),
			'menu_order'        => __( 'Page order', 'easy-web-translator' ),
			'_thumbnail_id'     => __( 'Featured image', 'easy-web-translator' ),
		);
	}
}
