import React from 'react'
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi"
import { Link } from 'react-router-dom';


function SideBar() {
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example" color='#4da890'>
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