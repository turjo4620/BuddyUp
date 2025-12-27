import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile } from '../api/api';

const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(id);
        if (response.success) {
          setProfile(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Profile not found</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            marginRight: '20px'
          }}>
            {getUserInitials(profile.name)}
          </div>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem' }}>{profile.name}</h1>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '1.1rem' }}>
              {profile.department} • {profile.academicYear}
            </p>
          </div>
        </div>

        {profile.bio && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px', color: '#374151' }}>About</h3>
            <p style={{ lineHeight: '1.6', color: '#6b7280' }}>{profile.bio}</p>
          </div>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#374151' }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.projectInterests && profile.projectInterests.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#374151' }}>Project Interests</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.projectInterests.map((interest, index) => (
                <span
                  key={index}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;