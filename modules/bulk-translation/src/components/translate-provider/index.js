// import YandexTranslater from "./yandex";
import localAiTranslator from "./local-ai/index.js";
import { sprintf, __ } from "@wordpress/i18n";
import { ChromeIcon } from "../../../../../assets/logo/chrome.js";

/**
 * Provides translation services using Yandex Translate.
 */
export default (props) => {
    props=props || {};
    const { Service = false, openErrorModalHandler=()=>{}, prefix='' } = props;
    const adminUrl = window.lmatBulkTranslationGlobal.admin_url;
    const assetsUrl = window.lmatBulkTranslationGlobal.lmat_url+'admin/assets/images/';
    const errorIcon = assetsUrl + 'error-icon.svg';
    const providers=window.lmatBulkTranslationGlobal.providers;

    const Services = {
        localAiTranslator: {
            Provider: localAiTranslator,
            title: "Chrome Built-in AI",
            SettingBtnText: "Translate",
            serviceLabel: "Chrome AI Translator",
            heading: sprintf(__("Translate Using %s", 'linguator-multilingual-chromeai-translation'), "Chrome built-in API"),
            Docs: "https://docs.coolplugins.net/doc/chrome-ai-translation-polylang/?utm_source=lmat_plugin&utm_medium=inside&utm_campaign=docs&utm_content=bulk_translate_chrome",
            BetaEnabled: true,
            ButtonDisabled: props.localAiTranslatorButtonDisabled,
            ErrorMessage: props.localAiTranslatorButtonDisabled ? <div className={`${prefix}-provider-error button button-primary`} onClick={() => openErrorModalHandler(props.localAiTranslatorButtonDisabled)}><img src={errorIcon} alt="error" /> {__('View Error', 'linguator-multilingual-chromeai-translation')}</div> : <></>,
            Logo: <ChromeIcon className="icon-size"  />,
            filterHtmlContent: true
        }
    };

    const validServices={};

    providers.forEach(provider=>{
        validServices[provider]=Services[provider];
    });

    if (!Service) {
        return validServices;
    }

    return validServices[Service];
};
