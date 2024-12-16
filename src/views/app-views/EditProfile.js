import React, { Component } from 'react';
import {
  Form,
  Avatar,
  Button,
  Input,
  Row,
  Col,
  message,
  Upload,
  Spin,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import Flex from 'components/shared-components/Flex';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

export class EditProfile extends Component {
  avatarEndpoint = 'https://www.mocky.io/v2/5cc8019d300000980a055e76';

  state = {
    name: '',
    email: '',
    username: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    getDataLoading: false,
    sendDataLoading: false,
  };

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  formRef = React.createRef();

  fetchUser = async (id) => {
    this.setState({
      getDataLoading: true,
    });
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      const data = await response.json();

      const { name, username, phone, email, website } = data;
      const { city } = data.address;

      this.setState(
        {
          name,
          username,
          phone,
          email,
          website,
          city,
        },
        () => {
          if (this.formRef.current) {
            this.formRef.current.setFieldsValue({
              name,
              username,
              phone,
              email,
              website,
              city,
            });
          }
        }
      );
    } catch (error) {
      console.log('Возникла ошибка!');
    } finally {
      this.setState({
        getDataLoading: false,
      });
    }
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetchUser(id);
  }

  render() {
    const onFinish = (values) => {
      const key = 'updatable';
      message.loading({ content: 'Updating...', key });
      setTimeout(() => {
        this.setState({
          name: values.name,
          email: values.email,
          userName: values.userName,
          dateOfBirth: values.dateOfBirth,
          phoneNumber: values.phoneNumber,
          website: values.website,
          address: values.address,
          city: values.city,
          postcode: values.postcode,
        });
        message.success({ content: 'Done!', key, duration: 2 });
      }, 1000);
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    const onUploadAavater = (info) => {
      const key = 'updatable';
      if (info.file.status === 'uploading') {
        message.loading({ content: 'Uploading...', key, duration: 1000 });
        return;
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, (imageUrl) =>
          this.setState({
            avatarUrl: imageUrl,
          })
        );
        message.success({ content: 'Uploaded!', key, duration: 1.5 });
      }
    };

    const onRemoveAvater = () => {
      this.setState({
        avatarUrl: '',
      });
    };

    const handleSendData = () => {
      this.setState({
        sendDataLoading: true,
      });
      setTimeout(() => {
        this.setState({
          sendDataLoading: false,
        });
        this.props.history.push(`${APP_PREFIX_PATH}/user-list`);
      }, 2000);
    };

    const { name, email, username, phone, website, address, city } = this.state;

    return this.state.getDataLoading ? (
      <Spin
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    ) : (
      <>
        <Flex
          alignItems="center"
          mobileFlex={false}
          className="text-center text-md-left"
        >
          <Avatar size={90} src={undefined} icon={<UserOutlined />} />
          <div className="ml-md-3 mt-md-0 mt-3">
            <Upload
              onChange={onUploadAavater}
              showUploadList={false}
              action={this.avatarEndpoint}
            >
              <Button type="primary">Change Avatar</Button>
            </Upload>
            <Button className="ml-2" onClick={onRemoveAvater}>
              Remove
            </Button>
          </div>
        </Flex>
        <div className="mt-4">
          <Form
            name="basicInformation"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              name: name,
              email: email,
              username: username,
              phone: phone,
              website: website,
              address: address,
              city: city,
            }}
            ref={this.formRef}
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={16}>
                <Row gutter={ROW_GUTTER}>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your name!',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your username!',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: 'email',
                          message: 'Please enter a valid email!',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item label="Phone" name="phone">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item label="Website" name="website">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item label="City" name="city">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={this.state.sendDataLoading}
                  onClick={handleSendData}
                >
                  {this.state.sendDataLoading
                    ? 'Data sending...'
                    : 'Save Change'}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    );
  }
}

export default EditProfile;
