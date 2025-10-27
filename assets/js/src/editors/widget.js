/**
 * Widgets Editor integrations
 */

import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

// Attribute injection: add language choice attribute to all blocks.
const addLangChoiceAttribute = ( settings, name ) => {
    if ( ! settings.attributes ) {
        settings.attributes = {};
    }
    settings.attributes.ewtLang = {
        type: 'string',
        default: ''
    };
    return settings;
};

addFilter( 'blocks.registerBlockType', 'ewt/lang-choice', addLangChoiceAttribute );

// UI control: exposes attribute in InspectorControls.
const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        const { attributes, setAttributes } = props;
        const { ewtLang } = attributes;
        return (
            <>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody title={ __( 'Language', 'easy-wp-translator' ) }>
                        <SelectControl
                            label={ __( 'Display in language', 'easy-wp-translator' ) }
                            value={ ewtLang }
                            options={ [
                                { label: __( 'Any', 'easy-wp-translator' ), value: '' },
                                // Real options should be injected server-side/localized; placeholder values here.
                                { label: 'en', value: 'en' },
                                { label: 'fr', value: 'fr' },
                                { label: 'de', value: 'de' },
                            ] }
                            onChange={ ( value ) => setAttributes( { ewtLang: value } ) }
                        />
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
}, 'withInspectorControls' );

addFilter( 'editor.BlockEdit', 'ewt/lang-choice/controls', withInspectorControls );


