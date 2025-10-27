import CopyClipboard from "../copy-clipboard/index.js";
import { useEffect } from "@wordpress/element";
import DOMPurify from 'dompurify';

const ErrorModalBox = ({ message, onClose, Title }) => {

    let dummyElement = jQuery('<div>').append(message);
    const stringifiedMessage = dummyElement.html();
    dummyElement.remove();
    dummyElement = null;

    useEffect(() => {
        const clipboardElements = document.querySelectorAll('.chrome-ai-translator-flags');

        if (clipboardElements.length > 0) {
            clipboardElements.forEach(element => {

                element.classList.add('ewt-page-translation-tooltip-element');

                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const toolTipExists = element.querySelector('.ewt-page-translation-tooltip');
                    
                    if(toolTipExists){
                        return;
                    }

                    let toolTipElement = document.createElement('span');
                    toolTipElement.textContent = "Text to be copied.";
                    toolTipElement.className = 'ewt-page-translation-tooltip';
                    element.appendChild(toolTipElement);

                    CopyClipboard({ text: element.getAttribute('data-clipboard-text'), startCopyStatus: () => {
                        toolTipElement.classList.add('ewt-page-translation-tooltip-active');
                    }, endCopyStatus: () => {
                        setTimeout(() => {
                            toolTipElement.remove();
                        }, 800);
                    } });
                });
            });

            return () => {
                clipboardElements.forEach(element => {
                    element.removeEventListener('click', () => { });
                });
            };
        }
    }, []);

    return (
        <div className="ewt-page-translation-error-modal-box-container">
            <div className="ewt-page-translation-error-modal-box">
                <div className="ewt-page-translation-error-modal-box-header">
                    <span className="ewt-page-translation-error-modal-box-close" onClick={onClose}>×</span>
                    {Title && <h3>{Title}</h3>}
                </div>
                <div className="ewt-page-translation-error-modal-box-body">
                    <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(stringifiedMessage) }} />
                </div>
                <div className="ewt-page-translation-error-modal-box-footer">
                    <button className="ewt-page-translation-error-modal-box-close button button-primary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModalBox;
