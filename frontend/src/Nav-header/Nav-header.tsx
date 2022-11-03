import React, { useContext } from "react";
import { Box, Header, Heading, HeadingExtendedProps, Menu, Nav, ResponsiveContext } from "grommet";
import { Link, NavLink, NavLinkProps, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import styled from "styled-components";
import './Nav-header.css';
import { sizeIsM, sizeIsS } from "../grommet/utils";

const Nameplate = styled<React.FC<HeadingExtendedProps & { respSize: string }>>(Heading)`
  border-top: ${({respSize}) => sizeIsS(respSize) ? '12px' : '25px'} solid #4E2A84;
  border-bottom: ${({respSize}) => sizeIsS(respSize) ? '12px' : '25px'} solid #4E2A84;
  font-size: ${({respSize}) => sizeIsS(respSize) ? '16pt' : (sizeIsM(respSize) ? '32pt' : '50px')}
`;

interface MenuItem {
  label: string,
  link: string,
  altRoute?: string,
};

const menuItems: MenuItem[] = [
  { label: 'Games', link: '/', altRoute: '/game/:year/:week' },
  { label: 'Uniform Combinations', link: '/uniform' },
  { label: 'Timeline', link: '/timeline'},
  { label: 'About', link: '/about' },
];

function NavLinkAlt({ children, to, altRoute, ...props }: NavLinkProps & React.RefAttributes<HTMLAnchorElement> & { altRoute: string }) {
  const altMatch = useMatch({ path: useResolvedPath(altRoute).pathname });
  return <NavLink to={to}
    className={({ isActive }) => altMatch || isActive ? "nav-link-active" : ""} {...props}>
    {children}
  </NavLink>
}

export const NAV_HEIGHT = "180px";

export function NavHeader() {
  // const navTo = useNavigate();
  const size = useContext(ResponsiveContext);

  return <Header pad={{top: 'medium', horizontal: 'medium', bottom: sizeIsS(size) ? 'medium' : 'none'}}
    border="bottom" direction={sizeIsS(size) ? 'row' : 'column'} background="white"
    height={sizeIsS(size) ? "90px" : NAV_HEIGHT}>
    <Box direction="row" align="center" gap="small">
      <Nameplate level="1" margin="none" respSize={size}>
        <Link to='/'>
          { size === 'small'
          ? 'NUFB Uniform Tracker'
          : 'Northwestern Wildcats Football Uniform Tracker'}
        </Link>
      </Nameplate>
    </Box>
    {size === 'small' ? (
      <Menu label="Menu"
        items={menuItems.map(({label, link})=> ({label, href: link}))}
      />
    ) : (
      <Nav direction="row">
        {menuItems.map(({label, link, altRoute}) => {
          return altRoute
          ? <NavLinkAlt to={link} key={label} altRoute={altRoute}>{label}</NavLinkAlt>
          : <NavLink to={link} key={label}
            className={({isActive}) => isActive  ? "nav-link-active" : ""}>
            {label}
          </NavLink>
        })}

      </Nav>
    )}
  </Header>
}
