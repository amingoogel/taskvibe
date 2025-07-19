import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
// اضافه کردن ایمپورت‌های MUI و آیکون‌ها
import { Box, Typography, TextField, Button, MenuItem, List, ListItem, ListItemIcon, ListItemText, Divider, Stack, Chip } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import UpdateIcon from '@mui/icons-material/Update';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

function GroupChallenge() {
  const [groups, setGroups] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [challengeUpdates, setChallengeUpdates] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [challengeTarget, setChallengeTarget] = useState(5);
  const [challengeDeadline, setChallengeDeadline] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatBoxRef = React.useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/groups/')
      .then(response => {
        setGroups(response.data);
        if (response.data.length > 0) setSelectedGroup(response.data[0].id);
      })
      .catch(error => {
        if (error.response?.status === 401) {
          alert('لطفاً دوباره وارد شوید (توکن منقضی شده یا معتبر نیست)');
          localStorage.removeItem('access_token');
          window.location.reload();
        }
      })
      .finally(() => setLoading(false));
    axios.get('http://localhost:8000/api/challenges/')
      .then(response => setChallenges(response.data))
      .catch(error => {
        if (error.response?.status === 401) {
          alert('لطفاً دوباره وارد شوید (توکن منقضی شده یا معتبر نیست)');
          localStorage.removeItem('access_token');
          window.location.reload();
        }
      });
    // WebSocket setup (optional, unchanged)
    if (groups.length > 0) {
      const ws = new WebSocket(`ws://localhost:8000/ws/challenge/${groups[0]?.id}/`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChallengeUpdates(prev => [...prev, data.message]);
      };
      return () => ws.close();
    }
    // Fetch chat history
    if (selectedGroup) {
      axios.get(`http://localhost:8000/api/groups/${selectedGroup}/messages/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
        .then(res => setChatMessages(res.data))
        .catch(() => setChatMessages([]));
      // WebSocket for chat
      const ws = new WebSocket(`ws://localhost:8000/ws/chat/${selectedGroup}/`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChatMessages(prev => [...prev, data.message]);
      };
      ws.onclose = () => {};
      ws.onerror = () => {};
      // Save ws to ref for sending
      chatBoxRef.current = ws;
      return () => ws.close();
    }
  }, []); // Only run once on mount

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('نام گروه را وارد کنید!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/groups/', {
        name: groupName
      });
      setGroups([...groups, response.data]);
      setGroupName('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.detail || error.response?.data?.error || 'ساخت گروه ناموفق بود!');
    }
  };

  const handleCreateChallenge = async () => {
    if (!selectedGroup) {
      setError('یک گروه انتخاب کنید!');
      return;
    }
    if (!challengeTitle.trim() || !challengeDescription.trim() || !challengeDeadline) {
      setError('همه فیلدهای چالش را پر کنید!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/challenges/', {
        group: selectedGroup,
        title: challengeTitle,
        description: challengeDescription,
        target_tasks: challengeTarget,
        deadline: challengeDeadline
      });
      setChallenges([...challenges, response.data]);
      setChallengeTitle('');
      setChallengeDescription('');
      setChallengeTarget(5);
      setChallengeDeadline('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.detail || error.response?.data?.error || 'ساخت چالش ناموفق بود!');
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim() && chatBoxRef.current && localStorage.getItem('user_id')) {
      chatBoxRef.current.send(JSON.stringify({
        user_id: localStorage.getItem('user_id'),
        content: chatInput.trim(),
      }));
      setChatInput('');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3, p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        <GroupsIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
        گروه‌ها و چالش‌ها <span role="img" aria-label="trophy">🏆</span>
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="نام گروه"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          fullWidth
        />
        <Button
          onClick={handleCreateGroup}
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          fullWidth
        >
          ساخت گروه
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          label="انتخاب گروه"
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
          fullWidth
        >
          <MenuItem value="">انتخاب گروه</MenuItem>
          {groups.map(group => (
            <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="عنوان چالش"
          value={challengeTitle}
          onChange={e => setChallengeTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="توضیحات چالش"
          value={challengeDescription}
          onChange={e => setChallengeDescription(e.target.value)}
          fullWidth
        />
        <TextField
          label="تعداد تسک هدف"
          type="number"
          value={challengeTarget}
          onChange={e => setChallengeTarget(Number(e.target.value))}
          fullWidth
        />
        <TextField
          label="ددلاین"
          type="datetime-local"
          value={challengeDeadline}
          onChange={e => setChallengeDeadline(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Button
          onClick={handleCreateChallenge}
          variant="contained"
          color="secondary"
          startIcon={<EmojiEventsIcon />}
          fullWidth
        >
          ساخت چالش
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        <EmojiEventsIcon color="warning" sx={{ verticalAlign: 'middle', mr: 1 }} />
        چالش‌های فعال <span role="img" aria-label="challenge">🚩</span>
      </Typography>
      <List>
        {challenges.map(challenge => (
          <ListItem key={challenge.id} sx={{ bgcolor: 'grey.100', borderRadius: 2, mb: 1 }}>
            <ListItemIcon><EmojiEventsIcon color="warning" /></ListItemIcon>
            <ListItemText
              primary={challenge.title}
              secondary={<>
                هدف: <Chip label={challenge.target_tasks + ' تسک'} size="small" color="info" sx={{ mr: 1 }} />
                تا {new Date(challenge.deadline).toLocaleDateString('fa-IR')}
                <br />{challenge.description}
              </>}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        <UpdateIcon color="info" sx={{ verticalAlign: 'middle', mr: 1 }} />
        بروزرسانی چالش‌ها <span role="img" aria-label="update">🔄</span>
      </Typography>
      <List>
        {challengeUpdates.map((update, index) => (
          <ListItem key={index} sx={{ bgcolor: 'grey.100', borderRadius: 2, mb: 1 }}>
            <ListItemIcon><UpdateIcon color="info" /></ListItemIcon>
            <ListItemText
              primary={`کاربر ${update.user_id} ${update.completed_tasks} تسک انجام داد`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        <ChatIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
        گفتگوی گروهی <span role="img" aria-label="chat">💬</span>
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={80}><CircularProgress /></Box>
      ) : chatMessages.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ my: 2 }}>پیامی وجود ندارد.</Typography>
      ) : (
        <Box sx={{ maxHeight: 250, overflowY: 'auto', bgcolor: 'background.default', borderRadius: 2, p: 2, mb: 1, border: '1px solid #e5e7eb' }}>
          {chatMessages.map((msg, i) => (
            <Fade in timeout={400 + i * 50} key={i}>
              <Box sx={{ mb: 1, display: 'flex', flexDirection: 'column', alignItems: msg.user === localStorage.getItem('username') ? 'flex-end' : 'flex-start' }}>
                <Box sx={{ bgcolor: msg.user === localStorage.getItem('username') ? 'primary.light' : 'grey.200', color: 'text.primary', px: 2, py: 1, borderRadius: 2, maxWidth: '80%' }}>
                  <Typography variant="body2" fontWeight={700}>{msg.user}</Typography>
                  <Typography variant="body1">{msg.content}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(msg.timestamp).toLocaleTimeString('fa-IR')}</Typography>
                </Box>
              </Box>
            </Fade>
          ))}
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
          placeholder="پیام خود را بنویسید..."
          fullWidth
          size="small"
        />
        <Tooltip title="ارسال پیام" arrow>
          <Button variant="contained" color="primary" onClick={handleSendMessage} endIcon={<SendIcon />}>
            ارسال
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default GroupChallenge;