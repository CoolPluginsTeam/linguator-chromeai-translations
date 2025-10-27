import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Container, Input, Label, RadioButton, Switch } from '@bsf/force-ui'
import { Settings } from 'lucide-react';
import { __ } from '@wordpress/i18n'
import apiFetch from "@wordpress/api-fetch"
import { getNonce } from '../utils'
import { toast } from 'sonner'
import { languageSwitcherOptions } from '../utils'

const Switcher = ({ data, setData }) => {

     const [selectedLanguageSwitchers, setSelectedLanguageSwitchers] = React.useState(data.ewt_language_switcher_options || ['default']);
     const [handleButtonDisabled, setHandleButtonDisabled] = React.useState(true);

     const arraysEqualIgnoreOrder = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        
        const set1 = new Set(arr1);
        const set2 = new Set(arr2);
        
        return set1.size === set2.size && 
               [...set1].every(val => set2.has(val));
    };

    // Check for changes and update button state
    useEffect(() => {
        const hasChanges = !arraysEqualIgnoreOrder(selectedLanguageSwitchers, data.ewt_language_switcher_options || ['default']);
        setHandleButtonDisabled(!hasChanges);
    }, [selectedLanguageSwitchers, data.ewt_language_switcher_options]);

    //Handle Checkboxes of Language Switcher
    const handleLanguageSwitcherChange = (switcher) => {
        setSelectedLanguageSwitchers(prev => {
            if (prev.includes(switcher)) {
                return prev.filter(item => item !== switcher);
            } else {
                return [...prev, switcher];
            }
        });
    };
    function SaveSettings() {
        try {
            let apiBody = {
                ewt_language_switcher_options : selectedLanguageSwitchers
            }

            const response = apiFetch({
                path: 'ewt/v1/settings',
                method: 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': getNonce()
                },
                body: JSON.stringify(apiBody)
            }).then((response) => {
                    setData(prev => ({ ...prev, ...response }))
                    setHandleButtonDisabled(true);
                })

        } catch (error) {
            toast.error(error.message || __("Something went wrong", "easy-wp-translator"));
        }
    }

    return (
        <Container className='bg-white p-10 rounded-lg' cols="1" containerType='grid'>
            <Container className='flex items-center'>
                <Container.Item className='flex w-full justify-between px-4 gap-6'>
                    <h1 className='font-bold'>{__('Language Switcher Widget Configuration', 'easy-wp-translator')}</h1>
                    <Button
                        disabled={handleButtonDisabled}
                        className=""
                        iconPosition="left"
                        size="md"
                        tag="button"
                        type="button"
                        onClick={SaveSettings}
                        variant="primary"
                    >
                        {__('Save Settings', 'easy-wp-translator')}
                    </Button>
                </Container.Item>
            </Container>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
            <Container.Item className='p-6 rounded-lg' style={{ border: "1px solid #e5e7eb" }}>
                <Label size='md' className='font-bold flex items-center gap-2'>
                    <Settings className="flex-shrink-0 size-5 text-icon-secondary" />
                    {__('Widget Types', 'easy-wp-translator')}
                </Label>
                <Label variant='help'>
                    {__('Enable or disable different types of language switcher . You can enable multiple  types to provide different options for displaying the language switcher.', 'easy-wp-translator')}
                </Label>
                <div className='flex flex-col gap-2' style={{ marginTop: "20px" }}>
                    {
                        languageSwitcherOptions.map((switcher, index) => (
                            <div key={index} style={{ backgroundColor: "#fbfbfb" }}>
                                <div className='switcher p-6 rounded-lg'>
                                    <Container.Item>
                                        <h3 className='flex items-center gap-2'>
                                            {__(switcher.label, 'easy-wp-translator')}
                                        </h3>
                                        <p>
                                            {__(switcher.subheading, 'easy-wp-translator')}
                                        </p>
                                    </Container.Item>
                                    <Container.Item className='flex items-center justify-end' style={{ paddingRight: '30%' }}>
                                        <Switch
                                            aria-label={`Switch for ${switcher.label}`}
                                        id={`ewt_language_switcher_${switcher.value}`}
                                        onChange={() => handleLanguageSwitcherChange(switcher.value)}
                                        size="sm"
                                        value={selectedLanguageSwitchers.includes(switcher.value)}
                                        />
                                    </Container.Item>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Container.Item>
            <hr className="w-full border-b-0 border-x-0 border-t border-solid border-t-border-subtle" />
            <Container className='flex items-center justify-end'>
                <Container.Item className='flex gap-6'>
                    <Button
                        disabled={handleButtonDisabled}
                        className=""
                        iconPosition="left"
                        size="md"
                        tag="button"
                        type="button"
                        onClick={SaveSettings}
                        variant="primary"
                    >
                        {__('Save Settings', 'easy-wp-translator')}
                    </Button>

                </Container.Item>
            </Container>
        </Container>
    )
}

export default Switcher;