import { Select, Button } from '@bsf/force-ui'
import SetupContinueButton, { SetupBackButton } from './setup-continue-button'
import { getNonce } from '../utils'
import { setupContext } from '../pages/setup-page'
import { Plus, Trash } from 'lucide-react'
import apiFetch from '@wordpress/api-fetch'
import { toast } from 'sonner'
import { sprintf, __ } from '@wordpress/i18n'
import React from 'react'
import { MdDelete } from "react-icons/md";
import { language } from '@wordpress/icons'
import { FaStar } from "react-icons/fa";
const DropdownRenderLangauage = ({ flagUrl }) => {
  const { selectedLanguage, setSelectedLanguage } = React.useContext(setupContext) //get the context
  //condition accordingly if the url is send or the flag name
  if (selectedLanguage != null && selectedLanguage?.flag != null) return (<>
    {
      flagUrl ?
        <span>
          <img src={selectedLanguage?.flag.split(`"`)[1]} alt="" />
          {" " + selectedLanguage?.name}
        </span> :
        <span>
          <img src={`${window.ewt_setup_flag_data.flagsUrl}${selectedLanguage?.flag}.svg`} alt="" />
          {" " + selectedLanguage?.name + " - " + selectedLanguage?.locale}</span>
    }
  </>)
  else return (<div>{__('Select an option', 'easy-wp-translator')}</div>)
}


//Rendered the flag + name + locale (flag name-locale) to all  the required places
export const RenderedLanguage = ({ languageName, languageFlag, flagUrl, languageLocale }) => {
  //condition accordingly if the url is send or the flag name
  return (
    <>
      {
        flagUrl && languageFlag?.length > 12 ?
          <span>
            <img src={languageFlag?.split(`"`)[1]} alt="" />
            {" " + languageName + " - " + languageLocale}
          </span> :
          <span>
            <img src={`${window.ewt_setup_flag_data.flagsUrl}${languageFlag}.svg`} alt="" />
            {" " + languageName + " - " + languageLocale}</span>
      }
    </>
  )
}


const Languages = () => {
  const { setupProgress, setSetupProgress, selectedLanguageData, setSelectedLanguageData, setLanguageDialog, selectedLanguage, setSelectedLanguage, ewt_all_languages, currentSelectedLanguage, setCurrentSelectedLanguage, contentSelectedLanguage, setContentSelectedLanguage, showUntranslatedContent, setShowUntranslatedContent, languageDeleteConfirmer, setLanguageDeleteConfirmer, languageToDelete, setLanguageToDelete, languageDialog } = React.useContext(setupContext) //get context
  
  // Ensure selectedLanguageData is always an array
  const languagesArray = Array.isArray(selectedLanguageData) ? selectedLanguageData : [];
  
  let [validLanguages, setValidLanguages] = React.useState(ewt_all_languages.filter((language) => (language?.name && language?.flag && !languagesArray?.find((selectedLanguage) => selectedLanguage.locale === language.locale))))
  const originalListLanguages = React.useRef(ewt_all_languages.filter((language) => (language?.name && language?.flag && !languagesArray?.find((selectedLanguage) => selectedLanguage.locale === language.locale))))
  const [languageLoader,setLanguageLoader] = React.useState(false);

  // Reset language loader when dialog is closed
  React.useEffect(() => {
    if (!languageDialog && languageLoader) {
      setLanguageLoader(false)
    }
  }, [languageDialog, languageLoader])

  //add the languages
  async function handleClick() {
    if (
      selectedLanguage !== null &&
      selectedLanguage.id !== 'none' &&
      !currentSelectedLanguage.find(lang => lang.locale === selectedLanguage.locale) &&
      !languagesArray?.find((language) => language.locale === selectedLanguage.locale)
    ) {
      setCurrentSelectedLanguage([
        ...currentSelectedLanguage,
        selectedLanguage
      ]);
    } else if (selectedLanguage.flag == null) {
      toast.info("Please select a language");
    }
    setValidLanguages(validLanguages.filter((language) => language.locale !== selectedLanguage.locale))
    setSelectedLanguage({ id: 'none', name: __('None', 'easy-wp-translator'), flag: null, locale: null })
  }


  //Dynamic routing of next button accordingly
  function handleNavigate() {
    setSetupProgress("url")
    localStorage.setItem("setupProgress", "url");
  }

  //delete the languages from currentSelectedLanguage
  async function handleDelete(idx) {
    let deleted = currentSelectedLanguage.filter((_, index) => index != idx)
    if (!validLanguages.find((language) => language.locale === deleted.locale)) {
      let validLanguage = [...validLanguages, currentSelectedLanguage[idx]]
      validLanguage = validLanguage.sort((a, b) => {
        return a.code.localeCompare(b.code);
      });
      setValidLanguages(validLanguage)
    }
    setCurrentSelectedLanguage(deleted)

  }

  async function saveLanguage() {
    setLanguageLoader(true)
    try {
      //Condition whether to open dialog show warning or make an API call
      if (!currentSelectedLanguage.includes(selectedLanguage) && selectedLanguage.id != 'none') {
        setLanguageDialog(true)
        // Reset the loader state when dialog opens since we're not proceeding with API call
        setLanguageLoader(false)
      } else if (selectedLanguage.id == 'none' && currentSelectedLanguage.length == 0 && languagesArray?.length == 0) {
        throw new Error(__('You have to select a language to continue', 'easy-wp-translator'))
      } else {
        try {
          let languageResponse = {
            created: [],
            errors: []
          }
          if (currentSelectedLanguage?.length > 0) {
            let apiBody = [];

            //handle whether to send language code or language code
            for (let apicalls = 0; apicalls < currentSelectedLanguage?.length; apicalls++) {
              apiBody.push({ ...currentSelectedLanguage[apicalls], slug: currentSelectedLanguage[apicalls].code })
            }
            //API call to save languages to database
            languageResponse = await apiFetch({
              path: 'ewt/v1/languages',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': getNonce()
              },
              body: JSON.stringify(apiBody)
            })


          }

          languageResponse?.created.forEach((item) => {
            setSelectedLanguageData(prev => [...prev, item])
          })
          setCurrentSelectedLanguage([])

          if (languageResponse?.created?.length > 0) {
            let languagesSuccessToast = '';
            languageResponse.created.forEach((item) => {
              languagesSuccessToast += item?.name + ', ';
            })
            toast.success(`${languagesSuccessToast} added successfully`)
          }

          if (languageResponse?.errors?.length > 0) {
            let languagesErrorToast = '';
            languageResponse.errors.forEach((item) => {
              languagesErrorToast += item?.name + ', ';
            })
            throw new Error(`Please try again in some time to add ${languagesErrorToast} `)
          }

          if (languageResponse.errors.length === 0) {
            handleNavigate()
          }

        } catch (error) {
          setLanguageLoader(false)
          toast.error(__('Please try again later', 'easy-wp-translator'))
        }
        setLanguageLoader(false)
      }
    } catch (error) {
      setLanguageLoader(false)
      toast.error(error.message)
    }
  }


  return (
    <div className='mx-auto max-w-[600px] min-h-[40vh] p-10 bg-white shadow-sm flex flex-col'>
      <div className='flex-grow mb-5'>
        <p className='text-sm'>{__('This wizard will help you set up EasyWPTranslator to translate your website into multiple languages', 'easy-wp-translator')}</p>
        <p className='text-sm'>{__('First, let’s choose the languages for your website.', 'easy-wp-translator')}</p>
        <h2>{__('Translation Languages', 'easy-wp-translator')}</h2>
        <div className='flex items-end gap-2'>
          <Select
            combobox
            onChange={(value) => setSelectedLanguage(value)}
            searchFn={(query) => {
              // Always filter from the original full list to avoid getting stuck
              const filtered = ewt_all_languages.filter(lang =>
                (lang.name.toLowerCase().includes(query.toLowerCase()) || lang.locale.toLowerCase().includes(query.toLowerCase()) || lang.label.toLowerCase().includes(query.toLowerCase())) &&
                !languagesArray?.some(sl => sl.locale === lang.locale)
              );
              setValidLanguages(filtered);
            }}
            size="md"
            by="locale"
            value={selectedLanguage}
            searchPlaceholder="Search..."
          >
            <Select.Button
              label={__('Which languages do you want to translate your site into?', 'easy-wp-translator')}
              placeholder={__('Select an option', 'easy-wp-translator')}
              render={() => <DropdownRenderLangauage flagUrl={false} />}
            />
            <Select.Options >
              <Select.Option
                value={{ id: 'none', name: __('None', 'easy-wp-translator'), flag: null, locale: null }}
              >
                <span className="text-gray-500">{sprintf(__('None (%s)', 'easy-wp-translator'), __('Clear selection', 'easy-wp-translator'))}</span>
              </Select.Option>
              {
                validLanguages.map((language, index) => (
                  <Select.Option
                    key={index}
                    value={language}
                  >
                    {
                      language?.name && language?.flag &&
                      <RenderedLanguage languageName={language?.name} languageFlag={language?.flag} flagUrl={false} languageLocale={language?.locale} />
                    }
                  </Select.Option>
                ))
              }
            </Select.Options>
          </Select>
          <Button
            className="flex items-center  h-10 w-[20%]"
            icon={<Plus />}
            iconPosition="left"
            size="sm"
            tag="button"
            type="button"
            onClick={handleClick}
            variant="primary"
          >
            {__('ADD', 'easy-wp-translator')}
          </Button>
        </div>
      </div>
      {
        currentSelectedLanguage.length > 0 &&
        <div style={{ paddingTop: "10px" }}>
          <h4 className='m-0 ' style={{paddingBottom: "6px"}}>{__('Languages to be added', 'easy-wp-translator')}</h4>
          {
            currentSelectedLanguage?.length > 0 && currentSelectedLanguage.map((language, index) => (
              <div className='flex justify-between items-center ' key={index} style={{paddingBottom: "6px"}}>
                <RenderedLanguage languageName={language?.name} languageFlag={language?.flag} flagUrl={false} languageLocale={language?.locale} />
                <MdDelete
                  onClick={() => handleDelete(index)}
                  className='cursor-pointer'
                  style={{ color: "red" }}
                />
              </div>
            ))
          }
        </div>
      }
      {
        languagesArray?.length > 0 &&
        <div className='py-4'>
          <h4 className='m-0 ' style={{paddingBottom: "6px"}}>{__('Selected Languages', 'easy-wp-translator')}</h4>
          <table style={{ width: "100%" }}>
            <tbody>
              {
                languagesArray?.map((language, index) => (
                  <tr key={index} style={{paddingBottom: "6px"}}>
                    <td style={{ width: "80%" }} className='flex gap-6 items-center'>
                      <RenderedLanguage languageName={language?.name} languageFlag={language?.flag} flagUrl={true} languageLocale={language?.locale} />
                      {
                        language.is_default &&
                        <FaStar />
                      }
                    </td>
                    <td style={{ width: "10%" }} className='relative' >
                      <MdDelete
                        onClick={() => { setLanguageToDelete(language); setLanguageDeleteConfirmer(true) }}
                        className='cursor-pointer absolute right-0 top-0'
                        style={{ color: "red" }}
                      />
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </div>
      }
      <div className='flex justify-between ' style={{ marginTop: "14px" }}>
              <SetupBackButton handleClick={() => {setSetupProgress("default");localStorage.setItem("setupProgress", "default")}} />
                {
                languageLoader?
                  <SetupContinueButton SaveSettings={() => { }} >
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    Loading...
                  </SetupContinueButton>
                  :
                  <SetupContinueButton SaveSettings={saveLanguage} />
              }
              
            </div>
      
    </div>
  )
}

export default Languages