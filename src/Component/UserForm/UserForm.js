import React, { useContext, useState } from 'react';
import { RegFormContextManager } from '../../App';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal'
import exam from '../../images/exam.jpg'


const UserForm = () => {
    const [getRegFormInfo, setRegFormInfo] = useContext(RegFormContextManager);
    const navigate = useNavigate();
    const [valuee, setValue] = useState('');


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("name : " + name)
        setRegFormInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name == 'phoneNumber') {
            const inputValue = e.target.value;
            const sanitizedValue = inputValue.replace(/\D/g, '');
            const limitedValue = sanitizedValue.slice(0, 11);
            setValue(limitedValue);
        }


    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(getRegFormInfo);
        navigate('/subject')
    };

    const handleBlur = () => {
        if (valuee.length !== 11) {
            alert('Input must have 11 digits.');
        }
    };

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <div className="container mx-auto pt-10 pb-10">
                <div className='flex justify-center items-center gap-20'>
                    <div className='mt-10'>
                        <img className='h-[450px] w-[450px] rounded' src={exam} />
                    </div>
                    <div>
                        <h2 className='mb-10 uppercase text-3xl font-extrabold'>
                            Candidate Information
                        </h2>
                        <form className="max-w-lg mx-auto w-[500px] bg-white shadow-md rounded px-8 pt-6 pb-2 mb-4" onSubmit={handleSubmit}>
                            <div className="mb-4 ">
                                <label className="block text-gray-700 text-left text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={getRegFormInfo.name}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm text-left font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={getRegFormInfo.email}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-left text-sm font-bold mb-2" htmlFor="phoneNumber">
                                    Phone Number
                                </label>
                                <div className="flex">
                                    <input
                                        className="shadow appearance-none border rounded w-28 py-2 px-3 bg-blue-100 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                        id="country"
                                        type="text"
                                        value="+88"
                                        name="country"
                                        disabled
                                    />
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="phoneNumber"
                                        type="text"
                                        name="phoneNumber"
                                        value={valuee}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                        placeholder="Enter your phone number"
                                        required
                                        onBlur={handleBlur}

                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <button
                                    className="bg-cyan-400 hover:bg-green-500 mt-6 mb-2 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Next
                                </button>
                            </div>
                        </form>
                        {/* <div>
                    <button onClick={openModal}>Open Modal</button>
                    <Modal isOpen={modalOpen} onClose={closeModal}>
                        <h2 className="text-lg font-bold">Modal Content</h2>
                        <p>This is the content of the modal.</p>
                    </Modal>
                </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
