/**
 * Site Editor sidebar bootstrap
 */

import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-site';

const SIDEBAR_NAME = 'ewt-site-sidebar';

const Sidebar = () => {
    return (
        <>
            <PluginSidebarMoreMenuItem target={ SIDEBAR_NAME }>
                { __( 'Languages', 'easy-wp-translator' ) }
            </PluginSidebarMoreMenuItem>
            <PluginSidebar name={ SIDEBAR_NAME } title={ __( 'Languages', 'easy-wp-translator' ) }>
                <div className="ewt-sidebar-section">
                    <p>{ __( 'EasyWPTranslator sidebar (Site Editor)', 'easy-wp-translator' ) }</p>
                </div>
            </PluginSidebar>
        </>
    );
};

registerPlugin( SIDEBAR_NAME, { render: Sidebar } );


