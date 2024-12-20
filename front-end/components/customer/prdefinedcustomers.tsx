import React from 'react';
import { useTranslation } from 'next-i18next';

const PredefinedCustomers: React.FC = () => {
    const { t } = useTranslation('common');

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-2 px-4 text-left">{t('username')}</th>
                            <th className="py-2 px-4 text-left">{t('password')}</th>
                            <th className="py-2 px-4 text-left">{t('role')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='border-b'>
                            <td className="py-2 px-4">@roland</td>
                            <td className="py-2 px-4">roland1234</td>
                            <td className="py-2 px-4">{t('admin')}</td>
                        </tr>
                        <tr className='border-b'>
                            <td className="py-2 px-4">@matej</td>
                            <td className="py-2 px-4">@matej1234</td>
                            <td className="py-2 px-4">{t('admin')}</td>
                        </tr>
                        <tr className='border-b'>
                            <td className="py-2 px-4">@Rhone</td>
                            <td className="py-2 px-4">Rhone_1245+</td>
                            <td className="py-2 px-4">{t('customer')}</td>
                        </tr>
                        <tr className='border-b'>
                            <td className="py-2 px-4">ozil</td>
                            <td className="py-2 px-4">ozil</td>
                            <td className="py-2 px-4">{t('customer')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default PredefinedCustomers;