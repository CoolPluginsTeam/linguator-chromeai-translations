import { __ } from "@wordpress/i18n";

const SettingModalFooter = (props) => {

    const { targetLangName, postType, sourceLangName, setSettingVisibility } = props;

    return (
        <div className="modal-footer">
            <p className="ewt-page-translation-error-message" style={{ marginBottom: '.5rem' }}>
                {sprintf(
                    __("This will replace your current %(postType)s with a %(target)s translation of the original %(source)s content.", 'easy-wp-translator'),
                    { postType: postType, source: sourceLangName, target: targetLangName }
                )}
            </p>
            <button className="ewt-page-translation-setting-close button button-primary" onClick={() => setSettingVisibility(false)}>{__("Close", 'easy-wp-translator')}</button>
        </div>
    );
}

export default SettingModalFooter;
