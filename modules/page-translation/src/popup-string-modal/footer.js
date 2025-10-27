import StringPopUpNotice from "./notice.js";
import { sprintf, __ } from "@wordpress/i18n";
import FormatNumberCount from "../component/format-number-count/index.js";

const StringPopUpFooter = (props) => {

    return (
        <div className="modal-footer" key={props.modalRender}>
            {!props.translatePendingStatus && <StringPopUpNotice className="ewt_page_translation_string_count"><p>{__('Wahooo! You have saved your valuable time via auto translating', 'easy-wp-translator')} <strong><FormatNumberCount number={props.characterCount} /></strong> {__('characters using', 'easy-wp-translator')} <strong>{props.serviceLabel}</strong>.</p></StringPopUpNotice>}
            <div className="save_btn_cont">
                <button className="notranslate save_it button button-primary" disabled={props.translatePendingStatus} onClick={props.updatePostData}>{props.translateButtonStatus ? <><span className="updating-text">{__("Updating", 'easy-wp-translator')}<span className="dot" style={{"--i": 0}}></span><span className="dot" style={{"--i": 1}}></span><span className ="dot" style={{"--i": 2}}></span></span></> : __("Update Content", 'easy-wp-translator')}</button>
            </div>
        </div>
    );
}

export default StringPopUpFooter;