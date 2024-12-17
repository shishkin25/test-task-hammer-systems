import { DashboardOutlined } from '@ant-design/icons';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const dashBoardNavTree = [
  {
    key: 'home',
    path: `${APP_PREFIX_PATH}/home`,
    title: 'home',
    icon: DashboardOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'users',
    path: `${APP_PREFIX_PATH}/user-list`,
    title: 'users',
    icon: UserOutlined,
    breadcrumb: false,
    submenu: [],
  },
  {
    key: 'planner',
    path: `${APP_PREFIX_PATH}/planner`,
    title: 'planner',
    icon: AppstoreOutlined,
    breadcrumb: false,
    submenu: [],
  },
];

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
