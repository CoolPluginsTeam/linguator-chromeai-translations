const ElementorWidgetTranslator = (props) => {
  const value = props.getControlValue();
  const activePageLanguage = window.ewtInlineTranslation?.pageLanguage || 'en';
  const TranslatorModal = window?.ewtInlineTranslation?.TranslatorModal;

  if (!TranslatorModal) {
    return <div>TranslatorModal not found</div>;
  }

  const onUpdateHandler = (value) => {
    props.activeController(value);
  }

  return <TranslatorModal modalOpen={true} value={value} onUpdate={onUpdateHandler} pageLanguage={activePageLanguage} />
}

export default ElementorWidgetTranslator;