import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  CgMenu,
  CgClose,
  CgChevronDown,
  CgArrowDown,
  CgProfile,
  CgChevronRight,
  CgArrowUp,
} from 'react-icons/cg';
import { FiShoppingBag } from 'react-icons/fi';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { getStatistics } from '../actions/userAccount';
import { logout } from '../utils/api';
import RootToggle from './Root';

const mapStateToProps = (state) => {
  return {
    usageInfo: state.userAccount.usageInfo,
  };
};

const NavBar = ({ userInfo, getStatistics, usageInfo }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const openCloseMenu = isMobileMenuOpen ? (
    <CgClose className="menu-icon" />
  ) : (
    <CgMenu className="menu-icon" />
  );

  useEffect(() => {
    fetch('/user_account/get_statistics')
      .then((response) => response.json())
      .then((data) => getStatistics(data.usage_info));
    const intervalId = setInterval(() => {
      fetch('/user_account/get_statistics')
        .then((response) => response.json())
        .then((data) => getStatistics(data.usage_info));
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const info = usageInfo[0];
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="nav-header">
        <div className="nav-header-content">
          <div className="nav-header-body">
            <div className="nav-header-img">
              <a href="/">
                <img
                  src={require('../../public/assets/images/chessify_logo_grey.svg')}
                  alt="Chessify"
                />
              </a>
            </div>
            <div className="statistic">
              <span className="nav-header-body_info">
                Today:
                <span className="nav-header-body_today">
                  {info && ' ' + info.minutes + 'min'}
                </span>
                <span style={{ margin: '0 4px', color: '#358C65' }}>
                  {info && info.increase ? <CgArrowUp /> : <CgArrowDown />}
                  {info && info.diff + '%'}
                </span>
              </span>
              {/* <Link to="/statistics" className="nav-header-statistic">
                All statistics
              </Link> */}
            </div>
          </div>
          <div className="nav-header-info">
            <Link to="/analysis" className="all-statistic">
              Dashboard
            </Link>
            <span className="coins">
              Coins: <p>{userInfo.balance}</p>
              <a href="/pricing" className="buy-btn">
                <FiShoppingBag />
                Buy
              </a>
            </span>
            <span className="user-name">
              <Link to="/analysis/account_settings">
                <CgProfile className="profile-img" />
                {userInfo.username}
              </Link>
              <button className="chevron-down" onClick={toggleMenu}>
                <CgChevronDown className="chevron-down-icon" />
              </button>
              {isMenuOpen && (
                <div className="menu-div">
                  <div className="menu">
                    <Link
                      to="/analysis/account_settings"
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                    >
                      Account Settings
                    </Link>
                    <a href="/contact">Help Center</a>
                    <a href="/" className="change-btn" onClick={logout}>
                      Log out
                    </a>
                  </div>
                </div>
              )}
            </span>
            <div className="user-profile-img">
              <Link to="/analysis/account_settings">
                <CgProfile className="profile-img" />
              </Link>
              <i onClick={toggleMobileMenu}>{openCloseMenu}</i>
            </div>
            <div className="light-dark-switch">
              <RootToggle />
            </div>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {/* <div className="link_div">
            <Link
              to="/statistics"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              Statistics
            </Link>
            <CgChevronRight />
          </div> */}
          <div className="link_div">
            <Link
              to="/analysis/account_settings"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              Account Settings
            </Link>
            <CgChevronRight />
          </div>
          <div className="link_div">
            <a href="https://chessify.me/contact">Help Center</a>
            <CgChevronRight />
          </div>
          <div className="menu_buttons">
            <Link
              to="/analysis"
              className="green-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              Go to Dashboard
            </Link>
            <a href="/" className="change-btn" onClick={logout}>
              Log out
            </a>
            <div>
              <RootToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default connect(mapStateToProps, { getStatistics })(NavBar);
