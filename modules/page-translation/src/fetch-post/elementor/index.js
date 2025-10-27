import ElementorSaveSource from "../../store-source-string/elementor/index.js";

const fetchPostContent = async (props) => {
    const elementorPostData = ewtPageTranslationGlobal.elementorData && typeof ewtPageTranslationGlobal.elementorData === 'string' ? JSON.parse(ewtPageTranslationGlobal.elementorData) : ewtPageTranslationGlobal.elementorData;

    const content={
        widgetsContent:elementorPostData,
    }

    if(ewtPageTranslationGlobal.slug_translation_option === 'slug_translate'){
        content.slug_name=ewtPageTranslationGlobal.slug_name;
    }

    if(ewtPageTranslationGlobal.parent_post_title && '' !== ewtPageTranslationGlobal.parent_post_title){
        content.title=ewtPageTranslationGlobal.parent_post_title;
    }
    
    ElementorSaveSource(content);
    
    props.refPostData(content);
    props.updatePostDataFetch(true);
}

export default fetchPostContent;