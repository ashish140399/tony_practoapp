import styled from "styled-components";
import { MainHeaderHeight, SideBarWidth, SideLayoutPadding } from "../const";

export const PageContainer = styled.div`
    max-width: 100vw;
    // overflow-x: hidden;
`;
export const Layout = styled.div`
    display: flex;
    min-height: calc(100vh - ${MainHeaderHeight}px);
    box-sizing: border-box;
`;
export const MainHeader = styled.div`
    width: 100%;
    background: #3657c3;
    color: #fff;
    padding: 0px ${SideLayoutPadding}px;
    display: flex;
    align-items: center;
    height: ${MainHeaderHeight}px;
    box-sizing: border-box;
    .heading {
        font-size: 24px;
    }
`;
export const LeftLayout = styled.div`
    width: ${SideBarWidth}px;
    height: auto;
    background: #3657c3;
    padding: ${SideLayoutPadding}px ${SideLayoutPadding}px 0px;
    box-sizing: border-box;
    border-top: 1px solid #e0e0e0;
`;
export const RightLayout = styled.div`
    width: calc(100vw - ${SideBarWidth}px);
    padding: ${SideLayoutPadding}px;
    box-sizing: border-box;
`;

export const Sidebar = styled.div`
    background: #3657c3;
    color: #fff;
    .MuiButton-root {
        width: 100%;
        background: #fff !important;
        color: #1976d2 !important;
        text-transform: unset !important;
        font-weight: 600 !important;
        box-sizing: border-box;
    }
`;
export const MainSection = styled.div`
    width: 100%;
`;

export const ActionButtons = styled.div`
    position: absolute;
    right: ${SideLayoutPadding}px;
    bottom: ${SideLayoutPadding}px;
`;
