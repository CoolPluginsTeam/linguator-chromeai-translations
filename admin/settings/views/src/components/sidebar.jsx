import { Container, Button } from "@bsf/force-ui"
import { __ } from '@wordpress/i18n';

const Sidebar = () => {

  return (
    <>
      <div className='w-full'>
        <div className='w-full flex flex-col gap-8 rounded-lg'>
          <Container className='flex flex-col p-6  bg-white border border-gray-200 rounded-lg shadow-sm'>
            <Container.Item>
              <h2 className='text-lg font-semibold text-gray-900 mb-2'>{__('Auto Translation Status', 'linguator-multilingual-chromeai-translation')}</h2>
              <Container.Item className=''>
                <h1 className='text-3xl font-bold text-gray-900 m-0'>{window.lmat_settings?.translations_data?.total_character || 0}</h1>
                <p className='text-sm text-gray-600 m-0'>{__('Total Characters Translated!', 'linguator-multilingual-chromeai-translation')}</p>
              </Container.Item>
            </Container.Item>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle my-1" />
            <Container.Item className='w-full'>
              <Container.Item className='flex flex-col gap-1'>
                <div className='flex justify-between items-center'>
                  <h4 className='text-sm text-gray-700 m-0'>{__('Total Strings', 'linguator-multilingual-chromeai-translation')}</h4>
                  <p className='text-sm font-medium text-gray-900 m-0'>{window.lmat_settings?.translations_data?.total_string || 0}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <h4 className='text-sm text-gray-700 m-0'>{__('Total Pages / Posts', 'linguator-multilingual-chromeai-translation')}</h4>
                  <p className='text-sm font-medium text-gray-900 m-0'>{window.lmat_settings?.translations_data?.total_pages || 0}</p>
                </div>
                <div className='flex justify-between items-center'>
                  <h4 className='text-sm text-gray-700 m-0'>{__('Time Taken', 'linguator-multilingual-chromeai-translation')}</h4>
                  <p className='text-sm font-medium text-gray-900 m-0'>{window.lmat_settings?.translations_data?.total_time || 0}</p>
                </div>
                <div className='flex justify-between gap-2'>
                  <div className='flex flex-col gap-1'>
                    <h4 className='text-sm text-gray-700 m-0 text-nowrap'>{__('Service Providers', 'linguator-multilingual-chromeai-translation')}</h4>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                  {window.lmat_settings?.translations_data?.service_providers?.map((provider, index) => (
                    <span className='text-sm font-medium text-gray-900 m-0 bg-gray-200 px-2 py-1 rounded-md' key={index}>{provider}</span>
                  ))}
                  </div>
                </div>
              </Container.Item>
            </Container.Item>
          </Container>
        </div>

      </div>
    </>
  )
}

export default Sidebar