import React from 'react';

import { Layout, theme } from 'antd';
import PageSidebar from './sidebar';
import PageContent from './contentbar';
import PageBreadcrumb from './breadcrumb';
import Headerbar from './headerbar';

const { Footer } = Layout;

const PageLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const headerHeight = 64

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Headerbar colorBgContainer={colorBgContainer} />
      <Layout>
        <PageSidebar height={`calc(100vh - ${headerHeight}px)`} />
        <Layout>
          <PageBreadcrumb />
          <PageContent></PageContent>
          <Footer style={{ textAlign: 'center' }}>
            React Admin Dashboard ©{new Date().getFullYear()} Created by Yujian Xue
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
