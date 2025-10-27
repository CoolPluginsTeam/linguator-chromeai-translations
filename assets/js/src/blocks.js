/* global wp */
(function () {
    const { __ } = wp.i18n;
    const { registerBlockType, createBlock } = wp.blocks;
    const { Fragment } = wp.element;
    const {
      InspectorControls,
      useBlockProps,
    } = wp.blockEditor || wp.editor; // fallback for older WP
    const {
      PanelBody,
      ToggleControl,
      Disabled,
    } = wp.components;
    const ServerSideRender = (wp.serverSideRender && wp.serverSideRender.default) || wp.serverSideRender;
    const { addFilter } = wp.hooks;
  
    // ---------------------------------------------------------------------------
    // Icon: translation (simple inline SVG)
    // ---------------------------------------------------------------------------
    const TranslationIcon = function () {
      return wp.element.createElement('span', {
        className: 'easywptranslator-block-icon',
        style: {
          fontFamily: 'easywptranslator',
          fontSize: '20px',
          lineHeight: '1',
          display: 'inline-block'
        }
      }, '\ue900');
    };
  
    // ---------------------------------------------------------------------------
    // Icon: submenu chevron (used in nav dropdown)
    // ---------------------------------------------------------------------------
    const SubmenuChevron = function () {
      return wp.element.createElement(
        'svg',
        { width: 12, height: 12, viewBox: '0 0 12 12', xmlns: 'http://www.w3.org/2000/svg', fill: 'none' },
        wp.element.createElement('path', { d: 'M1.5 4L6 8l4.5-4', strokeWidth: 1.5, stroke: 'currentColor' })
      );
    };
  
    // ---------------------------------------------------------------------------
    // Shared attributes
    // ---------------------------------------------------------------------------
    const sharedAttributes = {
      dropdown: { type: 'boolean', default: false },
      show_names: { type: 'boolean', default: true },
      show_flags: { type: 'boolean', default: false },
      force_home: { type: 'boolean', default: false },
      hide_current: { type: 'boolean', default: false },
      hide_if_no_translation: { type: 'boolean', default: false },
    };
  
    // ---------------------------------------------------------------------------
    // Helper: ensure at least one of show_names/show_flags is true
    // ---------------------------------------------------------------------------
    function enforceNamesOrFlags(nextAttrs, currentAttrs) {
      const result = { ...currentAttrs, ...nextAttrs };
      if (result.show_names === false && result.show_flags === false) {
        // If the user just turned one off and both are now false, re-enable the other.
        // Prefer re-enabling the one that did NOT change in this update.
        if (typeof nextAttrs.show_names !== 'undefined') {
          result.show_flags = true;
        } else {
          result.show_names = true;
        }
      }
      return result;
    }
  
    // ---------------------------------------------------------------------------
    // Reusable inspector panel for both blocks
    // ---------------------------------------------------------------------------
    function SwitcherInspector({ attributes, setAttributes, showHideCurrentEvenInDropdown = false }) {
      const { dropdown, show_names, show_flags, force_home, hide_current, hide_if_no_translation } = attributes;
  
      const update = (patch) => {
        setAttributes(enforceNamesOrFlags(patch, attributes));
      };
  
      return wp.element.createElement(
        InspectorControls,
        {},
        wp.element.createElement(
          PanelBody,
          { title: __('Language switcher settings', 'easywptranslator') },
          wp.element.createElement(ToggleControl, {
            label: __('Display as dropdown', 'easywptranslator'),
            checked: !!dropdown,
            onChange: (v) => update({ dropdown: !!v }),
          }),
          (!dropdown || showHideCurrentEvenInDropdown) &&
            wp.element.createElement(ToggleControl, {
              label: __('Show language names', 'easywptranslator'),
              checked: !!show_names,
              onChange: (v) => update({ show_names: !!v }),
            }),
          (!dropdown || showHideCurrentEvenInDropdown) &&
            wp.element.createElement(ToggleControl, {
              label: __('Show flags', 'easywptranslator'),
              checked: !!show_flags,
              onChange: (v) => update({ show_flags: !!v }),
            }),
          wp.element.createElement(ToggleControl, {
            label: __('Force switch to homepage', 'easywptranslator'),
            checked: !!force_home,
            onChange: (v) => update({ force_home: !!v }),
          }),
          !attributes.dropdown &&
            wp.element.createElement(ToggleControl, {
              label: __('Hide current language', 'easywptranslator'),
              checked: !!hide_current,
              onChange: (v) => update({ hide_current: !!v }),
            }),
          wp.element.createElement(ToggleControl, {
            label: __('Hide languages without translation', 'easywptranslator'),
            checked: !!hide_if_no_translation,
            onChange: (v) => update({ hide_if_no_translation: !!v }),
          })
        )
      );
    }
  
    // ---------------------------------------------------------------------------
    // Regular block: easywptranslator/language-switcher
    // ---------------------------------------------------------------------------
    registerBlockType('easywptranslator/language-switcher', {
      title: __('Language switcher', 'easywptranslator'),
      description: __('Add a language switcher so visitors can select their preferred language.', 'easywptranslator'),
      icon: TranslationIcon,
      category: 'widgets',
      attributes: { ...sharedAttributes },
      supports: {
        html: false,
      },
      edit: (props) => {
        const blockProps = useBlockProps ? useBlockProps() : {};
        return wp.element.createElement(
          Fragment,
          {},
          wp.element.createElement(SwitcherInspector, { attributes: props.attributes, setAttributes: props.setAttributes }),
          wp.element.createElement(
            Disabled,
            {},
            ServerSideRender
              ? wp.element.createElement(ServerSideRender, {
                  block: 'easywptranslator/language-switcher',
                  attributes: props.attributes,
                })
              : wp.element.createElement('div', blockProps, __('Language Switcher preview (SSR not available).', 'easywptranslator'))
          )
        );
      },
      save: () => null, // Rendered via PHP
    });
  
    // ---------------------------------------------------------------------------
    // Navigation child block: easywptranslator/navigation-language-switcher
    // ---------------------------------------------------------------------------
    const NAV_BLOCK = 'easywptranslator/navigation-language-switcher';
    registerBlockType(NAV_BLOCK, {
      title: __('Language switcher', 'easywptranslator'),
      description: __('Add a language switcher to the Navigation block.', 'easywptranslator'),
      icon: TranslationIcon,
      category: 'widgets',
      parent: ['core/navigation'],
      attributes: { ...sharedAttributes },
      usesContext: [
        'textColor',
        'customTextColor',
        'backgroundColor',
        'customBackgroundColor',
        'overlayTextColor',
        'customOverlayTextColor',
        'overlayBackgroundColor',
        'customOverlayBackgroundColor',
        'fontSize',
        'customFontSize',
        'showSubmenuIcon',
        'openSubmenusOnClick',
        'style',
      ],
      transforms: {
        from: [
          {
            type: 'block',
            blocks: ['core/navigation-link'],
            transform: () => createBlock(NAV_BLOCK),
          },
        ],
      },
      edit: (props) => {
        const { attributes, setAttributes, context } = props;
        const { showSubmenuIcon, openSubmenusOnClick } = context || {};
        const { dropdown } = attributes;
  
        const maybeSubmenuIcon =
          (dropdown && (showSubmenuIcon || openSubmenusOnClick)) ?
            wp.element.createElement('span', { className: 'wp-block-navigation__submenu-icon' }, wp.element.createElement(SubmenuChevron)) :
            null;
  
        return wp.element.createElement(
          Fragment,
          {},
          wp.element.createElement(SwitcherInspector, {
            attributes,
            setAttributes,
            // In the nav block we allow toggling names/flags even in dropdown for clarity
            showHideCurrentEvenInDropdown: true,
          }),
          wp.element.createElement(
            Disabled,
            {},
            wp.element.createElement(
              'div',
              { className: 'wp-block-navigation-item' },
              ServerSideRender
                ? wp.element.createElement(ServerSideRender, {
                    block: NAV_BLOCK,
                    attributes,
                    className: 'wp-block-navigation__container block-editor-block-list__layout',
                  })
                : wp.element.createElement('div', {}, __('Language Switcher (Navigation) preview (SSR not available).', 'easywptranslator')),
              maybeSubmenuIcon
            )
          )
        );
      },
      save: () => null, // Rendered via PHP
    });
  
    // ---------------------------------------------------------------------------
    // Classic Menu → Navigation conversion hook
    // Replaces a menu item with URL "#ewt_switcher" by our NAV_BLOCK with options from meta._ewt_menu_item
    // WARNING: relies on an unstable filter that may change across WP versions.
    // ---------------------------------------------------------------------------
    function mapBlockTree(blocks, menuItems, blocksMapping, mapper) {
      const convert = (block) => {
        const replaced = mapper(block, menuItems, blocksMapping);
        const innerBlocks = (replaced.innerBlocks || []).map((b) => convert(b));
        return { ...replaced, innerBlocks };
      };
      return blocks.map(convert);
    }
  
    function blocksFilter(block, menuItems, blocksMapping) {
      if (block.name === 'core/navigation-link' && block.attributes && block.attributes.url === '#ewt_switcher') {
        const menuItem = (menuItems || []).find((m) => m && m.url === '#ewt_switcher');
        const attrs = (menuItem && menuItem.meta && menuItem.meta._ewt_menu_item) || {};
        const newBlock = createBlock(NAV_BLOCK, attrs);
        if (menuItem && typeof menuItem.id !== 'undefined') {
          blocksMapping[menuItem.id] = newBlock.clientId;
        }
        return newBlock;
      }
      return block;
    }
  
    function menuItemsToBlocksFilter(blocks, menuItems) {
      return {
        ...blocks,
        innerBlocks: mapBlockTree(blocks.innerBlocks || [], menuItems || [], blocks.mapping || {}, blocksFilter),
      };
    }
  
    addFilter(
      'blocks.navigation.__unstableMenuItemsToBlocks',
      'easywptranslator/include-language-switcher',
      menuItemsToBlocksFilter
    );
  })();
  