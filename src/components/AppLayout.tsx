// src/components/AppLayout.tsx
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  ShoppingOutlined,
  FileTextOutlined,
  BookOutlined,
  CommentOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: '/',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: '/posts',
      icon: <FileTextOutlined />,
      label: 'Posts',
    },
    {
      key: '/recipes',
      icon: <BookOutlined />,
      label: 'Recipes',
    },
    {
      key: '/comments',
      icon: <CommentOutlined />,
      label: 'Comments',
    },
    {
      key: '/todos',
      icon: <CheckSquareOutlined />,
      label: 'Todos',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        <div style={{ padding: '0 24px', fontSize: '20px', fontWeight: 'bold' }}>
          CRUD Application
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: '#fff',
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;