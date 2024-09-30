import axios from "axios";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import baseUrl from "../../Components/services/baseUrl";

const RequestModal = ({ show, handleClose,moneyRequests,fetchIncomingRequest,fetchAccountInfo }) => {
   
    const handleAcceptTransaction = (tId) => {    
        try {
            axios.patch(`${baseUrl}/api/transaction/approve/${tId}`)
            .then(res=>{
                fetchIncomingRequest();
                fetchAccountInfo()
                alert("Transaction Complete")
            })
        } catch (error) {
            console.log(error);
        }    
        handleClose();
    };

    const handleDeclineTransaction = (tId) => {     
        try {
            axios.patch(`${baseUrl}/api/transaction/decline/${tId}`)
            .then(res=>{
                alert("Transaction Decline")
                fetchIncomingRequest();
                fetchAccountInfo()
            })
        } catch (error) {
            console.log(error);
        }
        
        handleClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white w-[700px] p-5 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Requests</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                {
                    moneyRequests.map((mq,index) =>
                        <div key={index} className="my-2 bg-orange-50">
                            <div className="shadow-md flex justify-between items-center">
                              <p className="text-xl p-2"><span className="">{index+1}) </span> <span className="text-green-500">{mq.senderId.fullName}</span> Request to {mq.type} <span className="text-red-500">{mq.amount} ৳</span> </p>  
                                <div className="flex mr-2 gap-3">
                                    <button onClick={()=>handleAcceptTransaction(mq._id)}  className="text-3xl text-green-500"><TiTick /></button>
                                    <button onClick={()=>handleDeclineTransaction(mq?._id)} className=" text-red-500"><ImCross /></button>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    );
};

export default RequestModal;
