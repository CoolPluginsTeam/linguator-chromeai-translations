import { Button } from '@bsf/force-ui'
import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import apiFetch from '@wordpress/api-fetch'
import { getNonce } from '../utils'

const Ready = () => {

   //get admin url
   let currentDomain = window.ewt_setup.admin_url;

   // Mark setup as complete when reaching the ready page
   React.useEffect(() => {
     const markSetupComplete = async () => {
       try {
         await apiFetch({
           path: 'ewt/v1/settings/setup-complete',
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'X-WP-Nonce': getNonce()
           },
           body: JSON.stringify({ complete: true })
         });
       } catch (error) {
         console.error('Failed to mark setup as complete:', error);
       }
     };
     
     markSetupComplete();
   }, []);

  //content for page
  let nextSteps = [ {
    button: __('Settings', 'easy-wp-translator'),
    href: `${currentDomain}admin.php?page=ewt_settings`,
    variant: 'outline'
  },{
    button: __('View Pages', 'easy-wp-translator'),
    href: `${currentDomain}edit.php?post_type=page`,
    variant: 'outline'
  },{
    button: __('View Posts', 'easy-wp-translator'),
    href: `${currentDomain}edit.php`,
    variant: 'outline'
  }]

 
  return (
    <div className='mx-auto max-w-[600px] min-h-[40vh] bg-white shadow-lg p-10 flex flex-col gap-6'>
      <h2 className='m-0'>{__("You're ready to translate your Site!", 'easy-wp-translator')}</h2>
      <div>
        <p className='m-0 text-sm/6' style={{ color: "#6b7280" }}>{__("You're now able to translate your content such as posts, pages, categories and tags. Start by exploring the options below to manage your translations.", 'easy-wp-translator')}</p>
      </div>
      <div className='flex gap-4 flex-wrap items-center justify-center'>
        {
          nextSteps.map((step, index) => (
            <div key={index}>
              <a href={step.href}>
                <Button
                  className=""
                  iconPosition="left"
                  size="sm"
                  tag="button"
                  type="button"
                  onClick={() => { }}
                  variant={step.variant}
                >
                  {step.button}
                </Button>
              </a>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Ready