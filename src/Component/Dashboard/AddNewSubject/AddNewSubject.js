import React, { useContext, useEffect, useState } from 'react';
import Dashboard from '../Dashboard';
import { UserContextManager, apiUrlContextManager } from '../../../App';




const AddNewSubject = () => {

    const [getSubjectList, setSubjectList] = useState([])
    const [getTopicList, setTopicList] = useState("")


    const [subTitle, setsubTitle] = useState('');
    const [subTitles, setsubTitles] = useState([]);
    const subjects = ['Subject 1', 'Subject 2', 'Subject 3', ...subTitles];

    const [topicTitle, setTopicTitle] = useState('');
    const [topicTitles, setTopicTitles] = useState([]);
    const topics = ['topic 1', 'topic 2', 'topic 3', ...topicTitles];

    const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
    const [selectedTopic, setSelectedTopic] = useState(topics[0]);

    const [getApiBasicUrl] = useContext(apiUrlContextManager);
    const [getUserInfo, setUserInfo, getToken, setToken, getAdminUserInfo, setAdminUserInfo] = useContext(UserContextManager);


    const subjectLoad = () => {

        fetch(`${getApiBasicUrl}/subjects`, {
            headers: {
                'Authorization': 'bearer ' + getToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => res.json())
            .then(data => setSubjectList(data))
    }

    const topicsLoad = () => {
        fetch(`${getApiBasicUrl}/question-sets?quesiton_subject_id=1`, {
            headers: {
                'Authorization': 'bearer ' + getToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => res.json())
            .then(data => setTopicList(data))
    }

    const topicLoadAfterFetch = (subId) => {

        fetch(`${getApiBasicUrl}/question-sets?quesiton_subject_id=${subId}`, {
            headers: {
                'Authorization': 'bearer ' + getToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(res => res.json())
            .then(data => setTopicList(data))
    }
    const handlesubTitleChange = (event) => {
        setsubTitle(event.target.value);
    };
    const handleTopicTitleChange = (event) => {
        setTopicTitle(event.target.value);
    };


    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
        topicLoadAfterFetch(event.target.value)

    };
    const handleTopicChange = (event) => {
        setSelectedTopic(event.target.value);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        const newSubjects = [...subTitles, subTitle];
        setsubTitles(newSubjects);
        setsubTitle('');

        const subjectData = {
            "subject_name": subTitle
        }

        fetch(`${getApiBasicUrl}/subject-info`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': 'bearer ' + getToken
            },
            body: JSON.stringify(subjectData),
        }
        ).then(res => res.json())
            .then(data => {
                console.log(data)
                subjectLoad()
            })
    };


    const handleTopicSubmit = (event) => {
        event.preventDefault();
        const newTopics = [...topicTitles, topicTitle];
        setTopicTitles(newTopics);
        setTopicTitle('');

        const setData = {
            "set_name": topicTitle,
            "question_subject_id": selectedSubject
        }

        fetch(`${getApiBasicUrl}/question-set-info`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': 'bearer ' + getToken
            },
            body: JSON.stringify(setData),
        }
        )
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const newTopic = {
                    id: newTopics.length + 1,
                    set_name: topicTitle
                };
                setTopicList([...getTopicList, newTopic]);
                // topicLoadAfterFetch(selectedSubject)
            })




    }

    useEffect(() => {
        subjectLoad();
        topicsLoad()
    }, [])

    return (
        <Dashboard>
            <div className='container mx-auto pt-8'>
                <h2 className='mb-8 text-3xl uppercase font-extrabold'>Create New Subject</h2>
                {/* Create new Subject start-------------------------------------- */}
                <div className="max-w-md mx-auto p-4  bg-cyan-50 shadow-lg rounded-md">
                    <label className="block text-left text-base font-semibold pb-2" htmlFor="newSubject">
                        Add New Subject
                    </label>
                    <div className="flex mb-4">

                        <input
                            className="w-full py-1 px-3 rounded border focus:outline-none shadow-lg border-gray-300"
                            type="text"
                            id="newSubject"
                            value={subTitle}
                            onChange={handlesubTitleChange}
                            required
                        />
                        <button
                            className="ml-2 rounded-lg px-4 bg-cyan-500 font-semibold shadow-lg hover:bg-green-500 text-white "
                            type="button"
                            onClick={handleSubmit}
                        >
                            Add
                        </button>

                    </div>


                </div>
                {/* Create new Subject end------------------------------------------ */}


                {/* Create new Topic Start------------------------------------- */}
                <div className="max-w-md mx-auto p-4 mt-8  bg-cyan-50 shadow-lg rounded-md">
                    <div className="mb-4">
                        <label className="block text-left text-base font-semibold pb-2" htmlFor="subject">
                            Subjects
                        </label>
                        <select
                            className="w-full py-1 px-3 rounded border focus:outline-none shadow-lg border-gray-200"
                            id="subject"
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                        >
                            <option value="">Select subject</option>
                            {getSubjectList.length > 0 &&
                                getSubjectList.map((data) => (
                                    <option key={data.id} value={data.id}>
                                        {data.subject_name}
                                    </option>
                                ))}
                        </select>

                    </div>
                    <label className="block text-left text-base font-semibold pb-2" htmlFor="newTopic">
                        Add New Topic
                    </label>
                    <div className="flex mb-4">

                        <input
                            className="w-full py-1 px-3 rounded border shadow-lg focus:outline-none border-gray-300"
                            type="text"
                            id="newTopic"
                            value={topicTitle}
                            onChange={handleTopicTitleChange}
                            required
                        />
                        <button
                            className="ml-2 rounded-lg px-4 shadow-lg bg-cyan-500 font-semibold hover:bg-green-500 text-white "
                            type="button"
                            onClick={handleTopicSubmit}
                        >
                            Add
                        </button>

                    </div>
                    <div className="mb-4 ">
                        <label className="block text-left text-base font-semibold pb-2" htmlFor="topic">
                            Topics
                        </label>
                        <ul
                            className=" py-1 rounded w-full divide-y divide-blue-200 border bg-white text-left  border-gray-200"
                            id="topic"
                            value={selectedTopic}
                            onChange={handleTopicChange}
                        >
                            {getTopicList.length > 0 &&
                                getTopicList.map((data) => (
                                    <li key={data.id} className='p-2'>
                                        {data.set_name}
                                    </li>
                                ))}
                        </ul>
                    </div>

                </div>

                {/* create new Topic end--------------------------------------------- */}
                {/* <div className="flex items-center justify-center">
                    <button
                        className="bg-green-500 hover:bg-orange-500 mt-4 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Submit
                    </button>
                </div> */}
            </div>
        </Dashboard>
    );
};

export default AddNewSubject;
