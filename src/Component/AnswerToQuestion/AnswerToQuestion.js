

import React, { useContext, useEffect, useState } from "react";
import q from './img/q.svg';
import { useLocation, useNavigate } from "react-router-dom";
import { RegFormContextManager, UserContextManager, apiUrlContextManager } from "../../App";

const AnswerToQuestion = () => {
    const [selectedOption, setSelectedOption] = useState([]);
    const [getQuestionList, setQuestionList] = useState([]);
    const [getQIndex, setQIndex] = useState(-1);
    const [getLimitTime, setLimitTime] = useState(0);
    const [counter, setCounter] = useState(0);
    const [getSwitchLoad, setSwitchLoad] = useState(false);
    const [getPopupBool, setPopupBool] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [getRegFormInfo, setRegFormInfo] = useContext(RegFormContextManager);
    const [getUserInfo, setUserInfo, getToken, setToken] = useContext(UserContextManager);
    const [getApiBasicUrl] = useContext(apiUrlContextManager);

    const handleOptionChange = (event) => {

        const checkValue = event.target.value;

        if (event.target.checked) {
            setSelectedOption([...selectedOption, checkValue]);
        } else {

            // console.log(selectedOption.includes(checkValue))

            const valueList = selectedOption;
            const arr = valueList.filter((item) => {
                return item !== checkValue
            })

            setSelectedOption(arr)

        }
        // console.log(" checked : " + event.target.checked);
    };

    // question answer and remaining 
    const totalQuestions = getQuestionList.length;
    const questionsAnswered = getQIndex + 1;
    // const questionsRemaining = totalQuestions - questionsAnswered;


    const resetData = () => {
        setSelectedOption([]);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with the selected option
        const selectedAnswers = selectedOption.join("|||");
        console.log(selectedAnswers)
        const answerData = {
            "qeustion_list_id": getQuestionList[getQIndex].id,
            "question_ans_list_id": selectedAnswers,
            "user_info_id": getUserInfo,
            "question_set_id": getRegFormInfo.questionSetId
        }

        if (selectedOption.length == 2) {

            fetch(`${getApiBasicUrl}/check-answer`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'Authorization': 'bearer ' + getToken
                },
                body: JSON.stringify(answerData),
            }
            ).then(res => res.json())
                .then(data => {
                    console.log("result : " + data + " index : " + getQIndex)
                    if (data == 200) {
                        setQIndex(getQIndex => getQIndex = getQIndex + 1);
                        setCounter(getLimitTime)
                        resetData()
                        getQuestionList.length - 1 == getQIndex && questionEndTime()
                    } else {
                        navigate('/exam-error')
                    }
                })
            resetData();
        } else {
            alert("Please select two answers from the options.")
        }

        // console.log(selectedOption);
    };

    const skipFunc = (e) => {
        e.preventDefault();
        const answerData = {
            "qeustion_list_id": getQuestionList[getQIndex].id,
            "question_ans_list_id": "0",
            "user_info_id": getUserInfo,
            "question_set_id": getRegFormInfo.questionSetId,
            "timeout": true
        }

        fetch(`${getApiBasicUrl}/check-answer`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': 'bearer ' + getToken
            },
            body: JSON.stringify(answerData),
        }
        ).then(res => res.json())
            .then(data => {
                console.log("result : " + data + " index : " + getQIndex)
                if (data == 200) {
                    setQIndex(getQIndex => getQIndex = getQIndex + 1);
                    setCounter(getLimitTime)
                    getQuestionList.length - 1 == getQIndex && questionEndTime()
                } else {
                    navigate('/exam-error')
                }
            })
        resetData();
    }

    const alphabetList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "G", "K"]
    const questionList = ["RED", "YELLOW", "BLUE", "GREEN"];

    // const colorList = ['orange', 'green', 'indigo', 'purple', 'fuchsia', 'rose']

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const timeOuter = () => {

        const answerData = {
            "qeustion_list_id": getQuestionList[getQIndex].id,
            "question_ans_list_id": "0",
            "user_info_id": getUserInfo,
            "question_set_id": getRegFormInfo.questionSetId,
            "timeout": true
        }


        fetch(`${getApiBasicUrl}/check-answer`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': 'bearer ' + getToken
            },
            body: JSON.stringify(answerData),
        }
        ).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data == 200) {
                    setQIndex(getQIndex => getQIndex = getQIndex + 1);
                    resetData()
                } else {
                    navigate('/exam-error')
                }
            })
    }

    const questionStartTime = () => {
        const startData = {
            "question_subject_id": getRegFormInfo.subjectId,
            "user_info_id": getUserInfo
        }

        fetch(`${getApiBasicUrl}/insert-candidate-master-info`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': 'bearer ' + getToken
            },
            body: JSON.stringify(startData),
        }
        ).then(res => res.json())
            .then(data => {
                console.log(data)
            })
    }

    const questionEndTime = () => {

        const EndData = {
            "question_subject_id": getRegFormInfo.subjectId,
            "user_info_id": getUserInfo
        }

        fetch(`${getApiBasicUrl}/update-candidate-master-info`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': 'bearer ' + getToken
            },
            body: JSON.stringify(EndData),
        }
        ).then(res => res.json())
            .then(data => {
                console.log(data)
                navigate('/exam/thankyou', { state: { userId: getUserInfo, subjectId: getRegFormInfo.subjectId } });
            })
    }

    useEffect(() => {
        setLimitTime(location.state.time);
        setCounter(location.state.time)
        setQuestionList(location.state.questions)
        setQIndex(0)
        questionStartTime()
        console.log("testing")
    }, [])

    useEffect(() => {

        const interval = setInterval(() => {
            setCounter((counter) => {
                if (counter === 0) {
                    clearInterval(interval);
                    timeOuter();
                    getQuestionList.length - 1 == getQIndex && navigate('/exam/thankyou', { state: { userId: getUserInfo, subjectId: getRegFormInfo.subjectId } });
                    return getLimitTime; // Restart the countdown from 30
                }
                return counter - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };

    }, [counter === 0, counter === getLimitTime]);


    useEffect(() => {
        const disableBackNavigation = (event) => {
            event.preventDefault();
            window.location.href = window.location.origin;
        };

        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', disableBackNavigation);

        return () => {
            window.removeEventListener('popstate', disableBackNavigation);
        };
    }, []);

    return (
        <>
            <div className="container mx-auto flex flex-col  w-[700px] pt-28">
                {/* <h1 className="text-6xl text-center font-bold mb-12">Question & Answer</h1> */}
                {/* {console.log(selectedOption)} */}

                <form className="">
                    <div className="mb-4 ">
                        <div className="bg-white rounded-lg relative py-5 px-3 shadow-md">
                            <img className="w-20 absolute top-[-55px] left-1/2 bg-white py-[15px] px-[20px] rounded-t-3xl" style={{ transform: 'translateX(-50%)' }} src={q} />
                            <label className="block text-xl font-semibold text-center">{typeof getQuestionList[getQIndex] !== 'undefined' && getQuestionList[getQIndex].question_name} <p className="text-xs ml-1 text-red-600">(select exactly two choices from the available options)</p></label>
                        </div>
                        <div className="pt-16 w-[60%] mx-auto flex flex-col gap-5">

                            {
                                typeof getQuestionList[getQIndex] !== 'undefined' && getQuestionList[getQIndex].ansList.map((data, index) => (
                                    <div key={index}
                                        className={`items-center text-xl gap-3 grid grid-cols-12 bg-[#f8f8f8] border-2 transition duration-300 border-white rounded-l cursor-pointer ${selectedOption.includes(data.id.toString()) ? 'bg-green-500 text-white' : ''
                                            }`}
                                    >
                                        {console.log("Testing : " + selectedOption.includes(data.id) + "  type of : " + typeof data.id)}
                                        <span className={`col-span-2 bg-indigo-500 text-white  py-2  px-0 rounded-l flex justify-center items-center h-full`}>
                                            <span> {alphabetList[index]}</span>
                                        </span>
                                        <input
                                            type="checkbox"
                                            id={`option${index + 1}`}
                                            value={data.id}
                                            checked={selectedOption.includes(data.id.toString())}
                                            onChange={handleOptionChange}
                                            className=" h-6 w-6 cursor-pointer hidden"
                                        // required
                                        />
                                        <label className="col-span-10 cursor-pointer text-left  py-2 " htmlFor={`option${index + 1}`}>
                                            {data.question_ans}
                                        </label>
                                    </div>
                                ))
                            }


                        </div>

                    </div>

                    <div className="flex justify-center gap-20 ">

                        <div className="flex justify-center">
                            <button onClick={(e)=>{e.preventDefault();setPopupBool(true)}} className="bg-orange-800  hover:bg-orange-500  text-2xl text-white font-bold py-2 px-8 mt-5 transition duration-300 rounded-xl">
                                Skip
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <button onClick={handleSubmit} type="submit" className="bg-green-500 hover:bg-orange-500  text-2xl text-white font-bold py-2 px-8 mt-5 transition duration-300 rounded-xl">
                                Next
                            </button>
                        </div>
                    </div>
                </form>
                <div className="absolute right-5 top-4 rounded-full border-[10px] border-white flex justify-center items-center text-6xl font-bold w-[150px] h-[150px] shadow-lg">
                    <span>{counter}</span>
                </div>
                <div className=" absolute left-8 top-8 p-4 rounded-lg bg-white">
                    <div className="  mx-auto flex flex-col ">
                        <h2 className="text-lg text-center font-bold ">
                            Answered: {questionsAnswered} / {totalQuestions}
                        </h2>
                        {/* <h2 className="text-lg text-center font-bold ">
                        Remaining: {questionsRemaining}
                    </h2> */}

                    </div>
                </div>
            </div>

            {getPopupBool && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-black opacity-75"></div>
                        </div>
                        <div className="relative z-50 w-[500px] inline-block px-6 py-8 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-[20px]">
                            <div className="flex flex-col gap-7">
                                <div className="flex flex-col justify-center text-center text-xl text-red-800 font-bold">
                                    <p>Are you sure you want to skip this question?</p>
                                </div>
                                <div>
                                    <div className="flex gap-3 justify-center">
                                        <div className="flex justify-center ">
                                            <button onClick={(e)=> {e.preventDefault(); setPopupBool(false)}} className="bg-orange-800  hover:bg-orange-500  text-2xl text-white font-bold py-2 px-8 mt-5 transition duration-300 rounded-xl">
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="flex justify-center">
                                            <button onClick={(e)=>{skipFunc(e); setPopupBool(false)}} className="bg-green-700  hover:bg-green-600  text-2xl text-white font-bold py-2 px-8 mt-5 transition duration-300 rounded-xl">
                                                OK
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};




export default AnswerToQuestion