import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../api/api';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    academicYear: '',
    bio: '',
    skills: [],
    projectInterests: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        department: user.department || '',
        academicYear: user.academicYear || '',
        bio: user.bio || '',
        skills: user.skills || [],
        projectInterests: user.projectInterests || []
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateProfile(user._id, formData);
      
      if (response.success) {
        updateUser(response.data);
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Edit Profile</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Department *</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <optiile;ditProflt Edefau

export };);
</div>
  
       </form>
   </div>n>
          </butto   
     hanges'}.' : 'Save Cving..ng ? 'Sa    {loadi}>
        led={loadingdisabt" ype="submitton t        <buutton>
         </b
   el  Canc          leCancel}>
={handon" onClickttype="bu   <button t
       '10px' }}>lex', gap: isplay: 'fstyle={{ ddiv 
        <</div>
       />
          self..."
 about yourTell others der="  placehol       px' }}
    '5rginTop:ma '8px', ing:00%', padd '1width: style={{ 
           4" rows="           Change}
{handleInput  onChange=       o}
   {formData.bi   value=     bio"
    ame="      n    a
  <textare
          Bio</label>     <label>  x' }}>
   ottom: '15pinBle={{ margdiv sty <       >

       </divt>
     </selec     n>
 uate</optioate">Gradduran value="G  <optio
          </option>h Yearth Year">4te="4lu vaion      <opt  on>
    /optir< Yea">3rdYeare="3rd on valu   <opti
         >ear</optionar">2nd YYend ="2n value <optio
           option>Year</r">1st st Yea value="1ion     <optn>
       ptiolect Year</oe="">Sen valu<optio           
 >         ' }}
 nTop: '5px margig: '8px',in%', padddth: '100tyle={{ wi s           required
      ge}
      utChanhandleInpnge={nCha     o
       Year}.academicData={form    value      
  demicYear"aca    name="t
        elec     <s
     abel>c Year *</lbel>Academila         <px' }}>
 m: '15marginBotto style={{         <div</div>

>
          </select     on>
   her</optir">OtOthevalue="tion  <op    n>
       nce</optiocieata Snce">Da Sciealue="Dat<option v            
ion></optignes"Design">Don value=