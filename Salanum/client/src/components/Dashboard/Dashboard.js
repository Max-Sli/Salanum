import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Wallet, 
  User, 
  LogOut, 
  Search,
  Plus,
  Moon,
  Sun,
  Bell,
  Shield,
  Zap
} from 'lucide-react';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const Sidebar = styled.div`
  width: 280px;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textInverse};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const UserInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.online};
  border: 2px solid ${props => props.theme.colors.surface};
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const NavSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  margin-bottom: 0.25rem;
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
  
  &.active {
    background: ${props => props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.primary};
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const NavText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
  
  &.active {
    background: ${props => props.theme.colors.primaryLight};
  }
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.gradients.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textInverse};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatName = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatPreview = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const ChatTime = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textTertiary};
`;

const UnreadBadge = styled.div`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textInverse};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  padding: 0.125rem 0.375rem;
  border-radius: ${props => props.theme.borderRadius.full};
  min-width: 18px;
  text-align: center;
`;

const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const FooterActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background};
`;

const WelcomeScreen = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`;

const WelcomeIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  
  svg {
    width: 48px;
    height: 48px;
    color: ${props => props.theme.colors.textInverse};
  }
`;

const WelcomeTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: 1rem;
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 500px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.primary};
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'profile') navigate('/profile');
    if (tab === 'settings') navigate('/settings');
    if (tab === 'wallet') navigate('/wallet');
  };

  const mockChats = [
    {
      id: '1',
      name: 'General Chat',
      lastMessage: 'Hello everyone!',
      time: '2 min ago',
      unread: 3,
      type: 'group'
    },
    {
      id: '2',
      name: 'John Doe',
      lastMessage: 'Thanks for the help!',
      time: '1 hour ago',
      unread: 0,
      type: 'private'
    },
    {
      id: '3',
      name: 'Crypto News',
      lastMessage: 'New Solana update released',
      time: '3 hours ago',
      unread: 1,
      type: 'channel'
    }
  ];

  const features = [
    {
      icon: <Shield />,
      title: 'Keeper Neural Security',
      description: 'Advanced neural network protection with biometric authentication'
    },
    {
      icon: <Zap />,
      title: 'AI Protection',
      description: 'Messages are automatically masked using AI to protect your privacy'
    },
    {
      icon: <Users />,
      title: 'Blockchain Security',
      description: 'Built on Solana blockchain with end-to-end encryption'
    }
  ];

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <UserProfile>
            <Avatar>
              {user?.profile?.firstName?.[0] || user?.username?.[0] || 'U'}
            </Avatar>
            <UserInfo>
              <h3>{user?.username}</h3>
              <p>{connected ? 'Online' : 'Offline'}</p>
            </UserInfo>
            <StatusIndicator />
          </UserProfile>
          
          <SearchBar>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>
        </SidebarHeader>

        <SidebarContent>
          <NavSection>
            <SectionTitle>Navigation</SectionTitle>
            <NavItem 
              className={activeTab === 'chats' ? 'active' : ''}
              onClick={() => setActiveTab('chats')}
            >
              <NavIcon><MessageSquare size={20} /></NavIcon>
              <NavText>Chats</NavText>
            </NavItem>
            <NavItem 
              className={activeTab === 'groups' ? 'active' : ''}
              onClick={() => setActiveTab('groups')}
            >
              <NavIcon><Users size={20} /></NavIcon>
              <NavText>Groups</NavText>
            </NavItem>
          </NavSection>

          <NavSection>
            <SectionTitle>Chats</SectionTitle>
            <ChatList>
              {mockChats.map(chat => (
                <ChatItem 
                  key={chat.id}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                >
                  <ChatAvatar>
                    {chat.name[0]}
                  </ChatAvatar>
                  <ChatInfo>
                    <ChatName>{chat.name}</ChatName>
                    <ChatPreview>{chat.lastMessage}</ChatPreview>
                  </ChatInfo>
                  <ChatMeta>
                    <ChatTime>{chat.time}</ChatTime>
                    {chat.unread > 0 && (
                      <UnreadBadge>{chat.unread}</UnreadBadge>
                    )}
                  </ChatMeta>
                </ChatItem>
              ))}
            </ChatList>
          </NavSection>
        </SidebarContent>

        <SidebarFooter>
          <FooterActions>
            <ActionButton onClick={() => handleNavClick('wallet')}>
              <Wallet size={16} />
            </ActionButton>
            <ActionButton onClick={() => handleNavClick('settings')}>
              <Settings size={16} />
            </ActionButton>
            <ActionButton onClick={handleLogout}>
              <LogOut size={16} />
            </ActionButton>
          </FooterActions>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <WelcomeScreen>
          <WelcomeIcon>
            <MessageSquare />
          </WelcomeIcon>
          <WelcomeTitle>Welcome to Salanum</WelcomeTitle>
          <WelcomeSubtitle>
            Your secure, decentralized messaging platform with Keeper neural security and AI-powered privacy protection
          </WelcomeSubtitle>
          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </WelcomeScreen>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
