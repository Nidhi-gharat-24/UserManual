import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TreeNode from './TreeNode';
import './TreeView.css';
import { useAuth } from '../AuthContext'; // Import useAuth to access logout

const TreeView = () => {
    const { logout } = useAuth(); // Use auth context for logout
    const location = useLocation();
    const { fileType, designation, sales_function, user_type, lang_id: initialLangId } = location.state || {};
    const [apiData, setApiData] = useState(null);
    const [fileUrls, setFileUrls] = useState([]);
    const [langId, setLangId] = useState(1);
    const [languages, setLanguages] = useState([]);
    const navigate = useNavigate();
    const user_types = user_type || ""; 
    const inactivityTime = 600000; // 10 minutes
    let timer;

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch('HPLSMSREP/rp-ss/Language/DisplayLang');
                if (!response.ok) throw new Error('Failed to fetch languages');
                const data = await response.json();
                setLanguages(data.Record);
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };

        fetchLanguages();

        // Reset timer on user activity
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                handleLogout(); // Call logout after inactivity
            }, inactivityTime);
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        resetTimer(); // Start the timer

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
        };
    }, []);

    useEffect(() => {
        const fetchApiData = async () => {
            try {
                if (fileType && designation && sales_function) {
                    const response = await fetch(
                        `HPLSMSREP/rp-ss/UserManualPDF/DisplayPDF?desg_level=${designation}&file_type=${fileType}&sales_function=${sales_function}&user_type=${user_types}`
                    );
                    if (!response.ok) throw new Error('Failed to fetch data');
                    const data = await response.json();
                    setApiData(data);
                    console.log("API Data:", data); // Debugging
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchApiData();
    }, [fileType, designation, sales_function]);

    useEffect(() => {
        const fetchFileUrls = async () => {
            try {
                if (fileType && designation && sales_function) {
                    const response = await fetch(
                        `HPLSMSREP/rp-ss/UserManualLang/DisplayPDF?desg_level=${designation}&file_type=${fileType}&sales_function=${sales_function}&user_type=${user_types}&lang_id=${langId}`
                    );
                    if (!response.ok) throw new Error('Failed to fetch file URLs');
                    const data = await response.json();
                    setFileUrls(data.Record);
                    console.log("File URLs:", data.Record); // Debugging
                }
            } catch (error) {
                console.error('Error fetching file URLs:', error);
            }
        };

        fetchFileUrls();
    }, [langId, fileType, designation, sales_function]);

    const handleLogout = () => {
        // Clear the login result from localStorage
        localStorage.removeItem('loginResult');

        // Log out the user and navigate to the home page
        logout();
        navigate('/');
    };

    const mergeFileUrls = (node, fileUrls) => {
        const fileUrlEntry = fileUrls.find(file =>
            file.usr_train_hdr_seq === node.usr_train_hdr_seq &&
            file.usr_train_dtl_seq === node.usr_train_dtl_seq
        );

        const mergedNode = {
            ...node,
            file_url: fileUrlEntry ? fileUrlEntry.file_url : null
        };

        if (mergedNode.ChildTaken && mergedNode.ChildTaken.length > 0) {
            mergedNode.ChildTaken = mergedNode.ChildTaken.map(child => mergeFileUrls(child, fileUrls));
        }

        if (mergedNode.CChildTaken && mergedNode.CChildTaken.length > 0) {
            mergedNode.CChildTaken = mergedNode.CChildTaken.map(cChild => mergeFileUrls(cChild, fileUrls));
        }

        return mergedNode;
    };

    const mergedData = apiData?.Record?.map(topic => mergeFileUrls(topic, fileUrls));

    console.log("Merged Data:", mergedData); // Debugging

    const handleLanguageChange = (event) => {
        setLangId(event.target.value);
    };

    const handleBackButtonClick = () => {
        navigate(-1);
    };

    return (
        <div className="page-container">
            {apiData && apiData.Record && apiData.Record.length > 0 && (
                <div className="header-container">
                    <h4 id='tv_hrad'>{apiData.Record[0].train_desc}</h4>
                    <select className="language-dropdown" value={langId} onChange={handleLanguageChange}>
                        {languages.map(language => (
                            <option key={language.lang_id} value={language.lang_id}>
                                {language.lang_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div id='BackButton'>
                <div className="back-arrow" onClick={handleBackButtonClick}>
                    &#8592;
                </div>
            </div>

            {mergedData && (
                <div className='treeholder'>
                    {mergedData.map((node) => (
                        <TreeNode key={node.usr_train_dtl_seq} node={node} fileType={fileType} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeView;
