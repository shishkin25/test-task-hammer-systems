import React, { Component } from 'react';
import { Card, Table, Tooltip, message, Button } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import UserView from './UserView';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

export class UserList extends Component {
  state = {
    users: [],
    userProfileVisible: false,
    selectedUser: null,
    loading: false,
  };

  fetchUsers = async () => {
    this.setState({
      loading: true,
    });
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      const data = await response.json();

      this.setState({
        users: data,
      });
    } catch (error) {
      console.log('Ошибка загрузки пользователей');
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  componentDidMount() {
    this.fetchUsers();
  }

  deleteUser = (userId) => {
    this.setState({
      users: this.state.users.filter((item) => item.id !== userId),
    });
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  showUserProfile = (userInfo) => {
    this.setState({
      userProfileVisible: true,
      selectedUser: userInfo,
    });
  };

  closeUserProfile = () => {
    this.setState({
      userProfileVisible: false,
      selectedUser: null,
    });
  };

  render() {
    const { users, userProfileVisible, selectedUser } = this.state;

    const handleUserClick = (id) => {
      this.props.history.push(`${APP_PREFIX_PATH}/edit-profile/${id}`);
    };

    const tableColumns = [
      {
        title: 'User',
        dataIndex: 'name',
        render: (_, record) => (
          <div className="d-flex">
            <AvatarStatus
              src={record.img}
              name={record.name}
              subTitle={record.email}
              onClick={() => handleUserClick(record.id)}
            />
          </div>
        ),
        sorter: {
          compare: (a, b) => {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: 'Username',
        dataIndex: 'username',
        sorter: {
          compare: (a, b) => {
            a = a.username.toLowerCase();
            b = b.username.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: 'City',
        dataIndex: 'address',
        render: ({ city }) => <span>{city}</span>,
        sorter: {
          compare: (a, b) => {
            a = a.address.city.toLowerCase();
            b = b.address.city.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: 'Website',
        dataIndex: 'website',
        render: (website) => <a href="#">{website}</a>,
        sorter: {
          compare: (a, b) => {
            a = a.website.toLowerCase();
            b = b.website.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: '',
        dataIndex: 'actions',
        render: (_, elm) => (
          <div className="text-right">
            <Tooltip title="View">
              <Button
                type="primary"
                className="mr-2"
                icon={<EyeOutlined />}
                onClick={() => {
                  this.showUserProfile(elm);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.deleteUser(elm.id);
                }}
                size="small"
              />
            </Tooltip>
          </div>
        ),
      },
    ];
    return (
      <Card bodyStyle={{ padding: '0px' }}>
        <Table
          columns={tableColumns}
          dataSource={users}
          rowKey="id"
          loading={this.state.loading}
        />
        <UserView
          data={selectedUser}
          visible={userProfileVisible}
          close={() => {
            this.closeUserProfile();
          }}
        />
      </Card>
    );
  }
}

export default UserList;
