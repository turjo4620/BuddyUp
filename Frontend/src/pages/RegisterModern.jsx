import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkUsernameAvailability } from '../api/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    department: '',
    academicYear: '',
    skills: '',
    projectInterests: '',
    email: '',
    bio: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  // Check username availability with debounce
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length >= 3) {
        setUsernameStatus({ checking: true, available: null, message: 'Checking...' });
        
        try {
          const response = await checkUsernameAvailability(formData.username);
          setUsernameStatus({
            checking: false,
            available: response.available,
            message: response.message
          });
        } catch (error) {
          setUsernameStatus({
            checking: false,
            available: null,
            message: 'Unable to check username'
          });
        }
      } else if (formData.username.length > 0) {
        setUsernameStatus({
          checking: false,
          available: false,
          message: 'Username must be at least 3 characters'
        });
      } else {
        setUsernameStatus({ checking: false, available: null, message: '' });
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  // Check password strength
  useEffect(() => {
    const checkPasswordStrength = () => {
      const password = formData.password;
      if (password.length === 0) {
        setPasswordStrength({ score: 0, message: '' });
        return;
      }

      let score = 0;
      let message = '';

      if (password.length >= 6) score += 1;
      if (password.length >= 8) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      if (score < 2) message = 'Weak password';
      else if (score < 4) message = 'Fair password';
      else if (score < 5) message = 'Good password';
      else message = 'Strong password';

      setPasswordStrength({ score, message });
    };

    checkPasswordStrength();
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error message when user starts typing
    if (message) setMessage('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (formData.username.length < 3) return 'Username must be at least 3 characters';
    if (!usernameStatus.available) return 'Username is not available';
    
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    
    if (!formData.name.trim()) return 'Full name is required';
    if (!formData.department.trim()) return 'Department is required';
    if (!formData.academicYear) return 'Academic year is required';
    if (!formData.skills.trim()) return 'At least one skill is required';
    if (!formData.projectInterests.trim()) return 'At least one project interest is required';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for API
      const userData = {
        username: formData.username.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim(),
        department: formData.department.trim(),
        academicYear: formData.academicYear,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        projectInterests: formData.projectInterests.split(',').map(interest => interest.trim()).filter(interest => interest),
        email: formData.email.trim() || undefined,
        bio: formData.bio.trim() || undefined
      };

      const result = await register(userData);
      
      if (result.success) {
        setMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="register-page">
        <div className="register-container">
          <div className="register-form-wrapper">
            <div className="loading">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const isFormValid = validateForm() === null && usernameStatus.available;

  return (
    <div className="register-page">
      {/* Animated Background */}
      <div className="register-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      <div className="register-container">
        <div className="register-form-wrapper">
          {/* Hero Section */}
          <div className="register-hero">
            <h1>Join BuddyUp</h1>
            <p>Create your profile to start finding amazing teammates</p>
          </div>

          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                required
                autoComplete="username"
                className="form-input"
              />
              {usernameStatus.message && (
                <small className={`helper-text ${
                  usernameStatus.available === true ? 'success' : 
                  usernameStatus.available === false ? 'error' : 'info'
                }`}>
                  {usernameStatus.checkiter;Regisfault ort de;
};

expv>
  )  </di</div>
       v>
 di</
        /div>        < </Link>
            k to Home
        ← Bac   ink">
    "back-l=Name/" classto="k <Lin            </p>
          Link>
  </             In
     Sign       ">
      ="auth-linkamessNlagin" cink to="/lo   <L           '}
t?{' e an accounhav  Already           >
  m: '16px' }}arginBotto: '#666', mle={{ color  <p sty         ">
 nks="auth-limelassNa  <div c      rm>

  /fo     <tton>
     bu </
           rofile'}e PCreat' : 'ile...reating Proftting ? 'CmisSub  {i   }
         span>ner"></pining-s"loadlassName= <span ctting &&isSubmi       {
               >tn"
    submit-bName="      class    id}
     !isFormValting ||d={isSubmit     disable      it"
   "subm      type=
        utton      <b

       </div>      all>
            </sm   cters
    h}/500 charaio.lengtmData.b  {for          
    >}`}         info'
     'error' : 'gth > 480 ? enata.bio.lformD                arning' : 
0 ? 'wength > 45rmData.bio.l     fo         
  r-text ${e={`helpe classNam   <small          />
           rea"
    ta"form-tex=className             
   ""500maxLength=              
  roject..." p for in akingloohat you're nce, and wrieexpeur  yo yourself,abouts ll other"Teceholder=       pla        
 ge}Chanhandle  onChange={           .bio}
   Dataue={formal     v
           "e="bioam           n    "bio"
       id=         xtarea
       <te       el>
 /lab(optional)<Bio ="bio">l htmlFor     <labe>
         m-group"ssName="foriv cla         <d   ional) */}
(Opt{/* Bio          /div>

     <         />
            put"
   form-inlassName=" c           l"
    "emaie=utoComplet  a              ty.edu"
rsiniveemail@ur.youolder="ehlac     p         ange}
  {handleChhange=       onC    mail}
     Data.eue={form      val       "
   "email      name=          il"
ema id="             email"
  type="                ut
np     <i     label>
    ional)</opt">Email (For="emailel html       <lab>
       "form-groupme="classNaiv     <d}
        */al) ail (Option/* Em {           </div>

          </small>
           ommas
     arated by ceperests snter your i  Ent             fo">
 -text inpere="helassNamclll ma        <s        />
           put"
 m-inName="forss    cla            uired
req           
     earch"pps, Rese A Mobilment, AI/ML, Develop="e.g., Webaceholder     pl          nge}
 ndleChahange={ha       onC     ts}
    ectInteresta.projalue={formDa  v        "
      stsectIntere"proj  name=             "
 restsprojectInte  id="            ext"
  pe="t        ty     t
    <inpu       bel>
      ated)</laar-sep* (commaerests Research Int">Project/erests"projectInttmlFor= h    <label
          up">form-grome="div classNa <        ts */}
   Interes/* Project    {        iv>

   </d      ll>
    </sma         
      by commastedlls separaour ski    Enter y          o">
  -text infpersName="helas <small cl          />
                 m-input"
ame="for classN                required
       "
        hrcs, ReseaData Analysiython, Script, Pe.g., Javaaceholder="   pl        nge}
     haandleC={hange  onCh           lls}
   ormData.ski   value={f   
          ls"me="skil      na          "skills"
         id="
       "text=type             input
          <
       d)</label>eparate * (comma-sls">Skillsr="skilmlFo<label ht              >
oup"e="form-gramiv classN   <d      s */}
    Skill/*          {

  v>  </di         >
 /select          <on>
    /optiD">PhD<="Phption value          <o
      ion>opte</aduatte">Grualue="Grad  <option va         ion>
     </opt">4th Yearh Yeare="4tvalu    <option            >
 ar</option">3rd Year="3rd Yeoption value <               on>
 Year</opti>2ndar"e="2nd Yeluvaion     <opt      on>
      Year</opti Year">1st alue="1stoption v        <    tion>
    c Year</op Academi>Select"ion value="       <opt                >
 "
      orm-select"fe=    classNam           uired
 eq           range}
     ={handleChnChange  o          cYear}
    .academirmData={fo     value          cYear"
 "academi      name=
          icYear"academ   id="              <select
             /label>
ic Year *<r">AcademeaemicY"acadmlFor= <label ht             oup">
me="form-gr classNa   <div      
   c Year */}emi {/* Acad     

           </div>
                />t"
     npuame="form-isNclas       
            required           
  ering"ogy, Engine Biolter Science,mpu, Co"e.g.older=  placeh             
 eChange}hange={handl    onC         tment}
   eparmData.d={forvalue           nt"
     "departme  name=            t"
  epartmen    id="d      t"
       type="tex              t
   <inpu     
       el>ment *</lab">Departpartment"delFor=l htm     <labe   p">
      "form-grouclassName=     <div     
   artment */}Dep      {/* 

      </div>          />
              "
  inputrm-Name="fo     class        e"
   amete="n autoCompl     
          equired       r        e"
 ull namur f"Enter yor=aceholde        pl       leChange}
 handChange={         on  ame}
     ={formData.n     value      e"
     me="nam    na          ame"
  ="n   id            "
 xt"te    type=                <input

          abel>me *</lll Na"name">FuFor=<label html            up">
  "form-grov className=<di            */}
Full Name         {/* div>

      </          )}
         
     small>       </h
         matcnot words do     ❌ Pass            ">
  orext errer-tName="help classsmall     <         (
   &&rmPassword ata.confiormD fd !==.passwor&& formDatassword rmPa.confi  {formData             </div>
             on>
   </butt          ️‍🗨️'}
   ️' : '👁rd ? '👁wowConfirmPass    {sho       >
                     "
  ord-toggleme="passw  classNa         d)}
       PassworhowConfirmassword(!sShowConfirmP() => setlick={         onC   "
      e="buttonyp t                 button
        <>
               /        ' }}
  '3remght: paddingRi   style={{              m-input"
 ="forme     classNa          d"
   worasste="new-pCompleto      au            red
  requi            
    rd"wor passm your="Confiroldeeh        plac          
ge}hanhandleChange={         onC        }
 asswordata.confirmPe={formDvalu            d"
      irmPasswornf="coame n            ord"
     Passwrmnfi"cod=   i             word'}
  pass' : 'word ? 'textonfirmPasse={showCyp  t          
      ut      <inp        pper">
  rd-wraame="passwov classN       <di>
        *</labelordswm Pas">ConfirPassword"confirml htmlFor=    <labe         group">
 ame="form-classN<div          ord */}
   sswirm Pa* Conf        {/iv>

       </d         )}
          all>
       </sm           ssage}
  meength.asswordStr         {p       }`}>
           ss'
       : 'succe' rning ? 'wascore < 4ength.wordStrss    pa            ' : 
   2 ? 'errore <gth.scorStrenordsw      pas       
     -text ${me={`helperssNa  <small cla         (
      &&sage mesrength.wordSt   {pass             </div>
        tton>
      </bu         ️'}
      : '👁️‍🗨ord ? '👁️'  {showPassw             >
         
          "toggle"password-me= classNa          )}
       wPassword!showord(ShowPass{() => setck=    onCli             utton"
 type="b               
        <button   />
                        '3rem' }}
gRight: ={{ paddin     style     
        nput"-i"formName= class                
 word"ass-pte="newmple      autoCo             required
           "
      )6 charactersord (min re passwreate a secuolder="Cplaceh           
       e}{handleChanghange=   onC        rd}
       a.passwoe={formDat     valu       
      "swordname="pas              "
    ssword="pa    id      
        assword'}'text' : 'pPassword ? ={show    type              <input
             er">
   app-wrordame="passw<div classN         
      *</label>asswordsword">PpasmlFor="label ht         <
     oup">"form-gr className=<div       
     d */} {/* Passwor
           div>
  </                )}
>
        </small              
  ssage}atus.meameSt    {usern    
           ''}e ? '❌ ' :le === falsavailabtus.Sta    username              : 
 '✅ ' rue ? e === tablStatus.availme      userna           : 
   🔍 '? 'ng 