import React from 'react';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
const BrowesByCatogories = () => {

    const data = [
        {
            cat: "IT & Developemt",
            rating:"4.5",
            skills: "1,831 "
        },
        {
            cat: "Design & Creative",
            rating:"4.4",
            skills: "1,232"
        },
        {
            cat: "Legal",
            rating:"4.5",
            skills: "433"
        },
        {
            cat: "Sales & Marketing",
            rating:"4.6",
            skills: "904"
        },
        {
            cat: "Writing & Translation",
            rating:"4.7",
            skills: "2,432"
        },
        {
            cat: "Admin & Customer Support",
            rating:"4.6",
            skills: "4,321"
        },
        {
            cat: "Finance & Accounting",
            rating:"4.2",
            skills: "1,221"
        },
        {
            cat: "Engineering & Architecture",
            rating:"4.9",
            skills: "704"
        },
       
       
    ];
    return (
        <div>
           
            <div>
            <h2 className='mb-1 ' style={{ fontFamily:"" }}>Browse talent by category</h2>
            <p className='fw-bold mt-0 mx-2 text-muted'>Looking for work? <Link className="fw-normal" to="/jobs" >Browse jobs</Link></p>
            </div>
            <div className='row'>
                { data.map((e)=>(
                <div key={e.cat} className='col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 p-4'>
                    <div className='p-3'  style={{backgroundColor:"#E4EBE4", borderRadius:"7px"}}>
                    <h4>{e.cat}</h4>
                    <div className='mb-3'>
                    <span><StarIcon className="text-primary mb-1 " style={{fontSize:"20px"}} /></span>
                    <span className=' mx-2 fs-6 '>{e.rating}/5 </span>
                    <span  className='px-2 fs-6 text-muted m-3'>{e.skills} skills</span>
                    </div>
                    </div>
                </div>
                ))}

            </div>
        

        </div>
    );
}

export default BrowesByCatogories;
