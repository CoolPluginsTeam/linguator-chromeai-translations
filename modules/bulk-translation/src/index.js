import App from './App.js';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store } from './redux-store/store.js';
import { Provider } from 'react-redux';
import ErrorModalBox from './components/error-modal-box/index.js';
import { __, sprintf } from '@wordpress/i18n';

(() => {
    const BulkTranslate = (props) => {
        const [modalVisible, setModalVisible] = useState(false);
        const [postIds, setPostIds] = useState([]);
        const prefix=props.prefix;
        const providers=ewtBulkTranslationGlobal.providers;

        const [providerConfigError, setProviderConfigError] = useState(false);
        let providerConfigMsg = sprintf(__(
            '%sYou have not enabled any translation provider. Please enable at least one service provider to use bulk translation. Go to the %sTranslation Settings%s to configure a translation provider.%s',
            'easy-wp-translator'
        ),
        '<p>',
        `<strong><a href='${ewtBulkTranslationGlobal.admin_url}admin.php?page=ewt_settings&tab=translation' target='_blank' rel='noopener noreferrer'>`,
        '</a></strong>',
        '</p>');

        const handleModalVisibility = (e) => {
            e.preventDefault();
            let checkboxClass='table.widefat input[name="post[]"]:checked';

            if(ewtBulkTranslationGlobal.taxonomy_page && '' !== ewtBulkTranslationGlobal.taxonomy_page){
                checkboxClass='table.widefat input[name="delete_tags[]"]:checked';
            }

            const selectedPostIds=document.querySelectorAll(checkboxClass);
            const postIds=Array.from(selectedPostIds).map(postId=>postId.value);

            setPostIds(postIds);
            
            if(providers.length < 1){
                setProviderConfigError(prev => !prev);
                return;
            }

            setModalVisible(prev => !prev);
            

        }
        
        useEffect(() => {
            const doActionsBtn=document.querySelectorAll(`.${prefix}-btn`);
            if(doActionsBtn){
                doActionsBtn.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        handleModalVisibility(e);
                    });
                });
            }
        }, []);

        useEffect(() => {
            const mainWrapper=document.getElementById(`${prefix}-wrapper`);
            if(mainWrapper){
                mainWrapper.classList.toggle(`${prefix}-active`, modalVisible);
            }
        }, [modalVisible]);

        useEffect(() => {
            const mainWrapper=document.getElementById(`${prefix}-wrapper`);
            if(mainWrapper){
                mainWrapper.classList.toggle(`${prefix}-active`, providerConfigError);
            }
        }, [providerConfigError]);

        return (
            modalVisible ? (
                <App onDestory={handleModalVisibility} prefix={prefix} postIds={postIds} />
             ) : providerConfigError ? <div id={`${prefix}-container`}><ErrorModalBox message={providerConfigMsg} onDestroy={handleModalVisibility} onClose={handleModalVisibility} Title='Translation Provider Not Configured' prefix={prefix} /></div> : null
        );
    }
    
    window.addEventListener('load', async () => {
        const prefix='ewt-bulk-translate';

        await new Promise(resolve => setTimeout(resolve, 500));

        ReactDOM.createRoot(document.getElementById(`${prefix}-wrapper`)).render(
            <Provider store={store}>
                <BulkTranslate prefix={prefix} />
            </Provider>
        );
    });
})();
