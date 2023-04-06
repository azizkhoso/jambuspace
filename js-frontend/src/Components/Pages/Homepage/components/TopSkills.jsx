import { color } from '@mui/system';
import React from 'react';
import { useState } from 'react';

const TopSkills = () => {

    const [topSkills, setTopSkills] = useState(true);
    const [trendingSkills, setTrendingSkills] = useState(false);
    const [topSkillInUs, setTopSkillInUs] = useState(false);
    const [projectCatalog, setProjectCatalog] = useState(false);

    const topskills1 = [
        
            "Data Entry Specialists",
            "Video Editors",
            "Data Analyst",
            "Shopify Developer",
            "Ruby on Rails Developer",
            "Android Developer",
            "Bookkeeper",
            "Content Writer",
            "Copywriter",
            "Database Administrator",
            "Data Scientist",
            "Front-End Developer",
            "Game Developer",
            "Graphic Designer",
            "iOS Developer",
            "Java Developer",
        
    ]
    const topskills2 = [
        
            "JavaScript Developer",
            "Logo Designer",
            "Mobile App Developer",
            "PHP Developer",
            "Python Developer",
            "Resume Writer",
            "SEO Expert",
            "Social Media Manager",
            "Software Developer",
            "Software Engineer",
            "Technical Writer",
            "UI Designer",
            "UX Designer",
            "Virtual Assistant",
            "Web Designer",
            "Wordpress Developer"
        
    ]
    const trendingSkills1 = [
        "Blockchain",
        "Go development",
        "Node.js",
        "Vue.js",
        "HR consulting",
        "Microsoft Power BI",
        "Instructional design",
        "React.js",
        "Videographers",
        "HTML5 Developers",
        "Ghostwriters",
        "Unity 3D Developers",
        "Business Consultants",
        "Coders",
        "Marketing Consultants",
        "Web Developers",
       
    ]
    const trendingSkills2 = [
        "Illustrators",
        "Google AdWords Experts",
        "Digital Marketers",
        "Project Managers",
        "Arduino Programmers",
        "Ruby Developers",
        "AngularJS Devleopers",
        "Full Stack Developers",
        "Email Marketing Consultants",
        "React Native Developers",
        "Swift Developers",
        "CSS Developers",
        "Google Sketchup Freelancers",
        "Back End Developers",
        "Smartsheet Freelancers",
        "Zoom Video Conferencing",
       
    ]
    const topskillsinUSA1 = [
        "Accountants in US",
        "CAD Designers in US",
        "Curriculum Developer in US",
        "Ebook Designers in US",
        "Fashion Designers in US",
        "Ghostwriters in US",
        "Google Adwords Experts in US",
        "Graphic Designers in US",
        "JavaScript Developers in US",
        "Product Developers in US",
        "Shopify Developers in US",
        "SquareSpace Developers in US",
        "Tax Preparers in US",
        "Technical Support Agents in US",
        "Virtual Assistants in US",
        "Web Designers in US",
        "WooCommerce Developers in US",
        "WordPress Developers in US",
        "Writers in US",
        "Zoho CRM Specialists in US",
        
    ]
    const topskillsinUSA2 = [
       "Accountants Near North Carolina",
      "Adobe Photoshop Experts Near San Antonio, TX",
      "Android Developers Near San Francisco, CA",
      "Bookkeepers Near Los Angeles, CA",
      "Business Coaches Near Atlanta, GA",
      "Fashion Designers Near Los Angeles, CA",
      "Grant Writers Near Chicago, IL",
      "Graphic Designers Near New York, NY",
      "Logo Designers Near Pittsburgh, PA",
      "Mechanical Engineers Near Seattle, WA",
      "Music Producers Near Chicago, IL",
      "Photo Editors Near Los Angeles, CA",
      "Photographers Near Brooklyn, NY",
      "Product Photographers Near Seattle, WA",
      "Resume Writers Near Chicago, IL",
      "SEO Experts Near New York, NY",
      "Social Media Managers Near Los Angeles, CA",
      "Videographers Near Dallas, TX",
      "Virtual Assistants Near Charlotte, NC",
      "Web Designers Near San Francis",
        
    ]
    const projCatalog1 = [
        "Resume Writing Services",
        "SEO Services",
        "Translation Services",
        "Transcription Services",
        "Virtual Assistant Services",
        "Email Marketing Services",
        "Web Design Services",
        "Proofreading Services",
        "Business Consulting Services",
        "Logo Design Services",
        "Architecture/Interior Design Services",
        "Branding Services",
        "Social Media Management Services",
        "Video Editing Services",
        "Lead Generation Services",
        "Content Marketing Services",
    ]
    const projCatalog2 = [
        "Survey Services",
        "Landscape Design Services",
        "Photoshop Services",
        "Mobile App Development Services",
        "Data Entry Services",
        "Building Information Modeling Services",
        "Podcast Editing Services",
        "Wellness Services",
        "HR Consulting Services",
        "Video Marketing Services",
        "WordPress Development Services",
        "Ecommerce Services",
        "Influencer Marketing Services",
        "Public Relations Services",
        "QA Services",
        "Podcast Marketing Services",
    ]



    return (
        <div>
            <div className="container">
                <div className='row  mt-5 mb-4'>
                    <div className='col-4'>
                        <button className='btn-topskill fs-1' onClick={()=> setTopSkills(true) +setTrendingSkills(false) + setTopSkillInUs(false) +setProjectCatalog(false) }>Top Skills</button>
                        <button className='btn-topskill fs-1' onClick={()=> setTopSkills(false) +setTrendingSkills(true) + setTopSkillInUs(false) +setProjectCatalog(false) }>Trending Skills</button>
                        <button className='btn-topskill fs-1' onClick={()=> setTopSkills(false) +setTrendingSkills(false) + setTopSkillInUs(true) +setProjectCatalog(false) }>Top Skills In US</button>
                        <button className='btn-topskill fs-1' onClick={()=> setTopSkills(false) +setTrendingSkills(false) + setTopSkillInUs(false) +setProjectCatalog(true) }>Project Catalog</button>
                        
                    </div>
                    {
                        topSkills &&
                        <div className='col-8 row'>
                            <div className='col-6'>
                                
                                   {
                                topskills1.map((s)=>(
                                 <h4 key={s} className='fs-4 text-muted'>{s}</h4>
                                )) } 
                               
                            </div>
                            <div className='col-6'>
                            {
                                topskills2.map((s)=>(
                                 <h4 key={s} className='fs-4 text-muted'>{s}</h4>
                                )) } 
                               
                            </div>
                        </div>
                        
                    }
                    {
                        trendingSkills &&
                        <div className='col-8 row'>
                             <div className='col-6'>
                             {
                                trendingSkills1.map((s)=>(
                                 <h4 key={s} className='fs-4 text-muted'>{s}</h4>
                                )) } 
                            </div>
                            <div className='col-6'>
                            {
                                trendingSkills2.map((s)=>(
                                 <h4 key={s} className='fs-4 text-muted'>{s}</h4>
                                )) } 
                            </div>
                            
                        </div>
                    }
                    {
                        topSkillInUs &&
                        <div className='col-8 row'>
                            <div className='col-6'>
                            {
                                topskillsinUSA1.map((s)=>(
                                 <h4 key={s} className='fs-4 text-muted'>{s}</h4>
                                )) } 
                            </div>
                            <div className='col-6'>
                            {
                                topskillsinUSA2.map((s)=>(
                                 <h4 key={s} className='fs-4 text-muted'>{s}</h4>
                                )) } 
                            </div>
                        </div>
                    }
                    {
                        projectCatalog &&
                        <div className='col-8 row'>
                            <div className='col-6'>
                            {
                                projCatalog1.map((s)=>(
                                 <h4 key={s} className='fs-4 text-muted'>{s}</h4>
                                )) } 
                            </div>
                            <div className='col-6'>
                            {
                                projCatalog2.map((s)=>(
                                 <h4 key={s} className='fs-4 text-muted'>{s}</h4>
                                )) }
                            </div>
                        </div>
                    }
                </div>

            </div>
        </div>
    );
}

export default TopSkills;
