import React, { useState } from 'react'
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi"
import { Link ,NavLink} from 'react-router-dom';


function SideBar() {
  const [open, setOpen] = useState(true);
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example" color='default'>
      <Sidebar.Logo href="#" img="logo.svg" imgAlt="Flowbite logo">
       
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            <Link to='/'>Dashboard</Link>
          </Sidebar.Item>
         
          <Sidebar.Item href="#" icon={HiInbox}>
            <Link to='/Projects'>Projects</Link>
            
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
          <Link to='/Projects'>Settings</Link>
            
          </Sidebar.Item>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    
  )
}

export default SideBar