                /* ============================================================
                DefenseSim — app.js
                Firebase Auth (Email/Pass) + Firestore backend
                ============================================================ */

                'use strict';

                /* ============================================================
                PDF.js worker
                ============================================================ */
                if (window.pdfjsLib) {
                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                }

                /* ============================================================
                FIREBASE CONFIG
                ============================================================ */
                const firebaseConfig = {
                apiKey: "AIzaSyAhLv7VZT6LSSZg_LL3oSK60BEsqfSJr-Q",
                authDomain: "case-1a0d5.firebaseapp.com",
                projectId: "case-1a0d5",
                storageBucket: "case-1a0d5.firebasestorage.app",
                messagingSenderId: "395262673226",
                appId: "1:395262673226:web:32affea4284fc2109601b3",
                measurementId: "G-B062MQKENP"
                };

                const STORE_DOCS     = 'defensesim_documents';
                const STORE_CHUNKS   = 'defensesim_chunks';
                const STORE_USERS    = 'defensesim_users';
                const STORE_LIVE     = 'defensesim_live';
                const STORE_SETTINGS = 'defensesim_settings';
                const LEADER_EMAIL   = 'gabrielagsamosam@gmail.com';

                const CHUNK_SIZE     = 900;
                const CHUNK_OVERLAP  = 120;
                const TOP_K          = 5;
                const BATCH_LIMIT    = 500;

                const SETTINGS_KEY = 'defensesim-settings';
                const LIVE_TTL_MS  = 60 * 60 * 1000; // 1 hour — live sessions auto-expire

                /* ============================================================
                EXAMINERS
                ============================================================ */
                const EXAMINERS = [
                {
                    id: 'methodology', name: 'Dr. Reyes', role: 'Methodology', avatar: '🔬',
                    focus: ['method', 'procedure', 'scope', 'limitation', 'transaction', 'atomic', 'queue', 'validation', 'testing'],
                    questionTemplates: [
                    'What are the specific scope and limitations of your study, particularly regarding the offline queue and server-side rendering?',
                    'Explain how you implemented atomic stock deduction using runTransaction(). What happens to stock if a sale fails midway?',
                    'Walk me through your testing approach. What specific edge cases did you test for variant-selection and offline-to-online transitions?',
                    'You mention "{keyword}" — what is your justification for this specific design decision in your system architecture?',
                    'If you were to redo this study, would you keep the same {keyword}? Why or why not?',
                    ],
                    followUpTemplates: [],
                },
                {
                    id: 'literature', name: 'Dr. Villanueva', role: 'Literature & Frameworks', avatar: '📚',
                    focus: ['theory', 'framework', 'literature', 'background', 'context', 'problem', 'P1', 'P15', 'manual'],
                    questionTemplates: [
                    'What is the main current problem you aimed to solve with this system, and how do you know it was a real issue for the target users?',
                    'Can you explain the background of your study and the specific operational pains of Kirby\'s Hardware that led to this research?',
                    'How does your system address the 15 specific problems (P1-P15) identified in your problem statement?',
                    'You referenced the capital cost barrier of commercial POS systems. How does your serverless architecture solve this?',
                    'You reference "{keyword}" — can you explain how this directly anchors your study?',
                    'How does your study extend or contradict the existing literature on {keyword}?',
                    ],
                    followUpTemplates: [],
                },
                {
                    id: 'application', name: 'Dr. Santos', role: 'Practical Application', avatar: '🛠',
                    focus: ['implication', 'recommendation', 'contribution', 'practical', 'beneficiary', 'cashier', 'owner', 'hardware'],
                    questionTemplates: [
                    'What is the concrete real-world implication of your 7-day revenue forecast for a small hardware store owner?',
                    'How does the system reduce checkout time and errors for cashiers compared to the carbon-copy method?',
                    'Who specifically benefits from the AI Assistant "Kirby", and how does it practically help with restocking?',
                    'You claim contribution via "{keyword}" — can you quantify that impact for a local hardware store?',
                    ],
                    followUpTemplates: [],
                },
                {
                    id: 'statistics', name: 'Dr. Lim', role: 'Statistics & Results', avatar: '📊',
                    focus: ['result', 'forecast', 'mape', 'interval', 'regression', 'data', 'analysis', 'accuracy'],
                    questionTemplates: [
                    'Walk me through the statistical basis for your 7-day revenue forecast. Why did you choose 95% prediction intervals?',
                    'How do you evaluate the accuracy of your forecasting models using rolling-origin cross-validation and MAPE?',
                    'What happens to your forecasting accuracy if the store has sparse historical data, such as operating for only three weeks?',
                    'If I challenged your forecasting model, what evidence in your study defends it?',
                    ],
                    followUpTemplates: [],
                },
                {
                    id: 'novelty', name: 'Dr. Navarro', role: 'Novelty & Contribution', avatar: '💡',
                    focus: ['novel', 'original', 'contribution', 'unique', 'hybrid', 'routing', 'serverless'],
                    questionTemplates: [
                    'What exactly is novel about your hybrid NLP and LLM routing for the Kirby assistant?',
                    'If your study were rejected for lack of novelty, how would you defend the combination of an offline-first POS and statistical forecasting?',
                    'State your single most important contribution to knowledge related to "{keyword}".',
                    'What did you do that no one has done before regarding the {keyword}?',
                    ],
                    followUpTemplates: [],
                },
                {
                    id: 'technical', name: 'Dr. Cruz', role: 'Technical Implementation', avatar: '💻',
                    focus: ['system', 'javascript', 'python', 'firebase', 'firestore', 'gemini', 'groq', 'variant', 'matrix', 'api', 'vercel', 'libraries', 'stack', 'database'],
                    questionTemplates: [
                    'What specific programming languages and frameworks did you use to build this system, and why did you choose them?',
                    'What API did you integrate for your AI assistant, and how did you handle the API keys securely on the backend?',
                    'What is Vercel, and why did you choose it as your deployment platform for both the frontend and Python backend?',
                    'Can you explain the difference between your Vanilla JS frontend and Python backend, and how they communicate via APIs?',
                    'What database did you use, and why is it better for your POS system than a traditional SQL database?',
                    'Why did you build your application in vanilla JavaScript (ES2022) without React, Vue, or Angular?',
                    'Explain how your application-level localStorage.pos_order_queue syncs with Firestore when connectivity returns.',
                    'Walk me through how you modeled the 0/1/2 option group variant matrix in Firestore. How do you prevent overselling on variants?',
                    'What specific data-science libraries in Python 3.11 did you use for your forecasting module?',
                    'Why did you choose Gemini as primary and Groq as fallback for your AI assistant, and how did you isolate provider errors?',
                    ],
                    followUpTemplates: [],
                },
                ];

                /* ============================================================
                STATE & UTILS
                ============================================================ */
                const state = {
                documents: [],
                chunks: [],
                idf: {},
                selectedExaminers: new Set(['methodology', 'literature', 'application']),
                settings: { useLLM: false, provider: 'openai', endpoint: '', model: '', apiKey: '' },
                session: null,
                auth: { currentUser: null },
                };

                const $  = (sel, root = document) => root.querySelector(sel);
                const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

                function escapeHtml(s) {
                return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                }
                function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
                function fmtBytes(n) {
                if (n < 1024) return n + ' B';
                if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
                return (n / 1024 / 1024).toFixed(2) + ' MB';
                }
                function toast(msg, kind = '') {
                const t = $('#toast');
                t.textContent = msg;
                t.className = 'toast show ' + kind;
                clearTimeout(toast._t);
                toast._t = setTimeout(() => { t.className = 'toast ' + kind; }, 3200);
                }
                function initials(name) {
                return name ? name.trim().slice(0, 2).replace(/[^a-zA-Z0-9]/g, '') : '?';
                }
                function truncate(s, n) { return s.length <= n ? s : s.slice(0, n).trim() + '…'; }

                /* ============================================================
                FIREBASE INIT
                ============================================================ */
                let db = null;
                let auth = null;
                let firebaseReady = false;

                function initFirebase() {
                if (typeof firebase === 'undefined') return false;
                try {
                    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
                    db = firebase.firestore();
                    auth = firebase.auth();
                    
                    // Bypass Edge QUIC blocking
                    db.settings({ experimentalForceLongPolling: true });
                    
                    firebaseReady = true;
                    return true;
                } catch (err) {
                    console.error('Firebase init failed:', err);
                    return false;
                }
                }

                /* ============================================================
                FIRESTORE DATA LAYER
                ============================================================ */
                async function dbAdd(collection, value) {
                const ref = await db.collection(collection).add(value);
                return ref.id;
                }
                async function dbAddMany(collection, values) {
                const ids = [];
                for (let i = 0; i < values.length; i += BATCH_LIMIT) {
                    const batch = db.batch();
                    for (const v of values.slice(i, i + BATCH_LIMIT)) {
                    const ref = db.collection(collection).doc();
                    batch.set(ref, v);
                    ids.push(ref.id);
                    }
                    await batch.commit();
                }
                return ids;
                }
                async function dbGetAll(collection) {
                const snap = await db.collection(collection).get();
                return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                }
                async function dbDelete(collection, id) {
                await db.collection(collection).doc(id).delete();
                }
                async function dbDeleteByIndex(collection, field, value) {
                const snap = await db.collection(collection).where(field, '==', value).get();
                if (snap.empty) return;
                const batch = db.batch();
                snap.docs.forEach((d) => batch.delete(d.ref));
                await batch.commit();
                }
                async function dbClear(collection) {
                const snap = await db.collection(collection).get();
                if (snap.empty) return;
                const batch = db.batch();
                snap.docs.forEach((d) => batch.delete(d.ref));
                await batch.commit();
                }

                /* ============================================================
                AUTHENTICATION (Firebase Auth)
                ============================================================ */
                async function adminExists() {
                try {
                    const snap = await db.collection(STORE_USERS).where('role', '==', 'admin').get();
                    return !snap.empty;
                } catch { return false; }
                }

                async function createMemberAccount(email, password) {
                email = String(email).trim();
                if (email.length < 5) throw new Error('Please enter a valid email.');
                if (password.length < 6) throw new Error('Password must be at least 6 characters.');
                
                const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
                const secondaryAuth = secondaryApp.auth();
                
                try {
                    const cred = await secondaryAuth.createUserWithEmailAndPassword(email, password);
                    await dbAdd(STORE_USERS, {
                    uid: cred.user.uid,
                    username: email,
                    role: 'member',
                    createdAt: Date.now()
                    });
                    await secondaryAuth.signOut();
                    await secondaryApp.delete();
                    return { username: email, role: 'member' };
                } catch (e) {
                    await secondaryApp.delete();
                    throw e;
                }
                }

                async function deleteUserAccount(docId) {
                const user = await db.collection(STORE_USERS).doc(docId).get();
                if (!user.exists || user.data().role === 'admin') return false;
                await dbDelete(STORE_USERS, docId);
                return true;
                }

                function applyRolePermissions() {
                const user = state.auth.currentUser;
                document.body.classList.toggle('role-member', user?.role === 'member');
                document.body.classList.toggle('role-admin', user?.role === 'admin');

                // Explicitly hide the Admin tab for non-admins
                const adminTab = $('#tabAdmin');
                if (adminTab) {
                    adminTab.classList.toggle('hidden', user?.role !== 'admin');
                }

                const chip = $('#userChip');
                if (user) {
                    chip.hidden = false;
                    $('#userAvatar').textContent = initials(user.username);
                    $('#userName').textContent = user.username;
                    const roleEl = $('#userRole');
                    roleEl.textContent = user.role === 'admin' ? 'Group leader' : 'Member';
                    roleEl.className = 'user-role ' + user.role;
                } else {
                    chip.hidden = true;
                }

                if (user?.role === 'member') {
                    if ($('#view-admin').classList.contains('active')) {
                    $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.view === 'defense'));
                    $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-defense'));
                    }
                    renderMemberList().catch(() => {});
                } else if (user?.role === 'admin') {
                    renderMemberList().catch(() => {});
                }
                }

                async function renderMemberList() {
                const list = $('#memberList');
                if (!list) return;

                const users = await dbGetAll(STORE_USERS);
                if (!users.length) {
                    list.innerHTML = '<div class="empty-state">No accounts yet.</div>';
                    return;
                }

                list.innerHTML = users
                    .slice()
                    .sort((a, b) => {
                    const rank = (u) => (u.role === 'admin' ? 0 : 1);
                    return rank(a) - rank(b) || (a.createdAt || 0) - (b.createdAt || 0);
                    })
                    .map((u) => {
                    const isAdmin = u.role === 'admin';
                    const canDelete = !isAdmin;
                    return `
                        <div class="member-item">
                        <div class="member-avatar">${escapeHtml(initials(u.username || '?'))}</div>
                        <div class="member-meta">
                            <div class="member-name">
                            ${escapeHtml(u.username || '?')}
                            <span class="badge ${u.role}">${isAdmin ? 'Admin' : 'Member'}</span>
                            </div>
                            <div class="member-sub">Created ${new Date(u.createdAt || Date.now()).toLocaleDateString()}</div>
                        </div>
                        <div class="file-actions">
                            ${canDelete ? `<button class="icon-btn" data-del-user="${u.id}" title="Delete member">✕</button>` : ''}
                        </div>
                        </div>
                    `;
                    })
                    .join('');

                $$('[data-del-user]', list).forEach((btn) => {
                    btn.addEventListener('click', async () => {
                    const id = btn.dataset.delUser;
                    if (!confirm('Delete this member account? They will no longer be able to sign in.')) return;
                    try {
                        const ok = await deleteUserAccount(id);
                        if (ok) { toast('Member account deleted.', 'ok'); await renderMemberList(); }
                        else toast('Cannot delete this account.', 'err');
                    } catch (e) {
                        toast('Delete failed: ' + e.message, 'err');
                    }
                    });
                });
                }

                /* ============================================================
                AUTH UI & LISTENERS
                ============================================================ */
                function showAuthSetup() {
                $('#authOverlay').hidden = false;
                $('#authSetup').classList.remove('hidden');
                $('#authLogin').classList.add('hidden');
                $('#authRegister').classList.add('hidden');
                setTimeout(() => $('#setupUser').focus(), 50);
                }
                function showAuthLogin() {
                $('#authOverlay').hidden = false;
                $('#authSetup').classList.add('hidden');
                $('#authLogin').classList.remove('hidden');
                $('#authRegister').classList.add('hidden');
                setTimeout(() => $('#loginUser').focus(), 50);
                }
                function showAuthRegister() {
                $('#authOverlay').hidden = false;
                $('#authSetup').classList.add('hidden');
                $('#authLogin').classList.add('hidden');
                $('#authRegister').classList.remove('hidden');
                setTimeout(() => $('#registerUser').focus(), 50);
                }
                function hideAuth() { $('#authOverlay').hidden = true; }

                function initAuth() {
                const doSetup = async () => {
                    const err = $('#setupError');
                    err.textContent = '';
                    const u = $('#setupUser').value.trim();
                    const p = $('#setupPass').value;
                    const p2 = $('#setupPass2').value;
                    
                    if (p !== p2) { err.textContent = 'Passwords do not match.'; return; }
                    if (u !== LEADER_EMAIL) {
                    err.textContent = `You must use the leader email: ${LEADER_EMAIL}`;
                    return;
                    }

                    try {
                    const cred = await auth.createUserWithEmailAndPassword(u, p);
                    await dbAdd(STORE_USERS, {
                        uid: cred.user.uid,
                        username: u,
                        role: 'admin',
                        createdAt: Date.now()
                    });
                    } catch (e) { 
                    err.textContent = e.message; 
                    }
                };
                $('#setupBtn').addEventListener('click', doSetup);
                $('#setupPass2').addEventListener('keydown', (e) => { if (e.key === 'Enter') doSetup(); });

                const doLogin = async () => {
                    const btn = $('#loginBtn');
                    const err = $('#loginError');
                    err.textContent = '';
                    btn.disabled = true;
                    btn.textContent = 'Signing in...';

                    const u = $('#loginUser').value.trim();
                    const p = $('#loginPass').value;

                    try {
                    // 10-second timeout to prevent infinite hanging in Edge
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Connection timed out. Please disable adblockers/tracking prevention or try Chrome.')), 10000)
                    );
                    
                    await Promise.race([
                        auth.signInWithEmailAndPassword(u, p),
                        timeoutPromise
                    ]);
                    } catch (e) {
                    err.textContent = e.message;
                    btn.disabled = false;
                    btn.textContent = 'Sign in';
                    }
                };
                $('#loginBtn').addEventListener('click', doLogin);
                $('#loginPass').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });

                $('#goToRegister').addEventListener('click', showAuthRegister);
                $('#goToLogin').addEventListener('click', showAuthLogin);

                const doRegister = async () => {
                    const err = $('#registerError');
                    err.textContent = '';
                    const u = $('#registerUser').value.trim();
                    const p = $('#registerPass').value;
                    const p2 = $('#registerPass2').value;

                    if (p !== p2) { err.textContent = 'Passwords do not match.'; return; }
                    if (p.length < 6) { err.textContent = 'Password must be at least 6 characters.'; return; }
                    if (u === LEADER_EMAIL) { err.textContent = 'This email is reserved for the Group Leader.'; return; }

                    const btn = $('#registerBtn');
                    btn.disabled = true;
                    btn.textContent = 'Creating...';

                    try {
                        const cred = await auth.createUserWithEmailAndPassword(u, p);
                        await dbAdd(STORE_USERS, {
                            uid: cred.user.uid,
                            username: u,
                            role: 'member',
                            createdAt: Date.now()
                        });
                        // Auth listener will automatically hide the overlay and log them in
                    } catch (e) {
                        err.textContent = e.message;
                        btn.disabled = false;
                        btn.textContent = 'Create Account';
                    }
                };
                $('#registerBtn').addEventListener('click', doRegister);
                $('#registerPass2').addEventListener('keydown', (e) => { if (e.key === 'Enter') doRegister(); });

                $('#logoutBtn').addEventListener('click', () => {
                    if (!confirm('Sign out of DefenseSim?')) return;
                    auth.signOut();
                });

                // Core Auth Listener
                auth.onAuthStateChanged(async (user) => {
                    const btn = $('#loginBtn');
                    if (btn) { btn.disabled = false; btn.textContent = 'Sign in'; }

                    if (user) {
                    // 1. Hide the login screen IMMEDIATELY so the user gets in
                    state.auth.currentUser = { uid: user.uid, username: user.email, role: 'member' };
                    hideAuth();
                    
                    // 2. Fetch role from Firestore in background
                    try {
                        const snap = await db.collection(STORE_USERS).where('uid', '==', user.uid).get();
                        let role = 'member';
                        
                        if (!snap.empty) {
                        role = snap.docs[0].data().role;
                        } else if (user.email === LEADER_EMAIL) {
                        role = 'admin';
                        }
                        
                        state.auth.currentUser.role = role;
                        applyRolePermissions();
                        toast(`Signed in as ${user.email}.`, 'ok');
                        
                        await reloadKB();
                        loadSettingsFromDB(); // Starts real-time listener
                        updateStartHint();
                    } catch (err) {
                        console.error('Failed to fetch user role:', err);
                        if (user.email === LEADER_EMAIL) state.auth.currentUser.role = 'admin';
                        applyRolePermissions();
                        toast('Logged in, but DB read failed. Check rules.', 'warn');
                    }
                    } else {
                    state.auth.currentUser = null;
                    applyRolePermissions();
                    $('#userChip').hidden = true;
                    
                    // Stop listening to settings when logged out
                    if (window.unsubscribeSettings) { 
                        window.unsubscribeSettings(); 
                        window.unsubscribeSettings = null; 
                    }

                    const hasAdmin = await adminExists();
                    if (!hasAdmin) showAuthSetup();
                    else showAuthLogin();
                    }
                });
                }

                /* ============================================================
                TABS
                ============================================================ */
                function initTabs() {
                $$('.tab').forEach((btn) => {
                    btn.addEventListener('click', () => {
                    if (btn.dataset.view === 'admin' && state.auth.currentUser?.role !== 'admin') {
                        toast('Admin access only.', 'warn');
                        return;
                    }
                    $$('.tab').forEach((b) => b.classList.toggle('active', b === btn));
                    const viewId = 'view-' + btn.dataset.view;
                    $$('.view').forEach((v) => v.classList.toggle('active', v.id === viewId));
                    if (btn.dataset.view === 'kb') renderKB();
                    if (btn.dataset.view === 'admin') {
                        // Prune sessions older than 1 hour, then open the realtime monitor
                        cleanupOldLiveSessions().finally(() => renderLiveMonitor());
                        
                        // Bind search listener once
                        const searchInp = $('#liveMonitorSearch');
                        if (searchInp && !searchInp.dataset.bound) {
                            searchInp.addEventListener('input', displayLiveMonitor);
                            searchInp.dataset.bound = 'true';
                        }
                        
                        // Bind clear ended button once
                        const clearBtn = $('#clearEndedLiveBtn');
                        if (clearBtn && !clearBtn.dataset.bound) {
                            clearBtn.addEventListener('click', async () => {
                                if (!confirm('Delete all ENDED defense sessions from the database?')) return;
                                try {
                                    const snap = await db.collection(STORE_LIVE).where('active', '==', false).get();
                                    if (snap.empty) return toast('No ended sessions to clear.', 'warn');
                                    const batch = db.batch();
                                    snap.docs.forEach(d => batch.delete(d.ref));
                                    await batch.commit();
                                    toast('Ended sessions cleared.', 'ok');
                                } catch (e) {
                                    toast('Failed to clear: ' + e.message, 'err');
                                }
                            });
                            clearBtn.dataset.bound = 'true';
                        }
                    }
                    });
                });
                }

                /* Prune live session docs older than LIVE_TTL_MS.
                Runs on every Admin tab open — cheap (1 query + 1 batch delete per run). */
                async function cleanupOldLiveSessions() {
                    if (!firebaseReady) return;
                    try {
                        const now = firebase.firestore.Timestamp.now();
                        const snap = await db.collection(STORE_LIVE)
                            .where('expireAt', '<', now)
                            .get();

                        // Never delete the session currently running in *this* tab
                        const skipId = state.session?.liveId;
                        const toDelete = snap.docs.filter(d => d.id !== skipId);
                        if (!toDelete.length) return;

                        for (let i = 0; i < toDelete.length; i += BATCH_LIMIT) {
                            const batch = db.batch();
                            toDelete.slice(i, i + BATCH_LIMIT).forEach(d => batch.delete(d.ref));
                            await batch.commit();
                        }
                        console.log(`Pruned ${toDelete.length} live session(s) older than 1 hour.`);
                    } catch (err) {
                        console.warn('Live session cleanup failed:', err);
                    }
                }

                async function renderLiveMonitor() {
                    const list = $('#liveMonitorList');
                    if (!list) return;
                    list.innerHTML = '<div class="muted small">Searching for sessions…</div>';
                    
                    if (window.liveMonitorUnsubscribe) window.liveMonitorUnsubscribe();
                    
                    // Fetch all sessions, ordered by newest first
                    window.liveMonitorUnsubscribe = db.collection(STORE_LIVE).orderBy('createdAt', 'desc').onSnapshot(snap => {
                        window._liveMonitorDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                        displayLiveMonitor();
                    });
                }

                function displayLiveMonitor() {
                    const list = $('#liveMonitorList');
                    if (!list) return;

                    let docs = window._liveMonitorDocs || [];
                    
                    // Sort: Active (LIVE) first, then newest
                    docs.sort((a, b) => {
                        if (a.active === b.active) return (b.createdAt || 0) - (a.createdAt || 0);
                        return a.active ? -1 : 1;
                    });

                    // Filter by search input
                    const q = $('#liveMonitorSearch') ? $('#liveMonitorSearch').value.trim().toLowerCase() : '';
                    if (q) {
                        docs = docs.filter(d => (d.email || '').toLowerCase().includes(q));
                    }

                    if (!docs.length) {
                        list.innerHTML = '<div class="empty-state">No defense sessions found.</div>';
                        return;
                    }
                    
                    // Save current inputs so the admin doesn't lose their draft when a new message arrives
                    const currentInputs = {};
                    docs.forEach(d => {
                        const inp = document.getElementById('injectQ-' + d.id);
                        if (inp) currentInputs[d.id] = inp.value;
                    });

                    list.innerHTML = docs.map(d => {
                        const data = d;
                        const chat = data.chat || [];
                        const chatHTML = chat.map(m => `
                            <div style="margin-bottom: 4px; font-size: 0.8rem;">
                                <strong>${m.sender === 'member' ? 'Student' : 'You'}:</strong> ${escapeHtml(m.text)}
                            </div>
                        `).join('');
                        
                        const statusBadge = data.active 
                            ? '<span style="color:var(--success); background:var(--success-soft); padding:2px 8px; border-radius:99px; font-size:0.7rem; font-weight:bold; margin-left:8px;">LIVE</span>' 
                            : '<span style="color:var(--text-faint); background:var(--panel-3); padding:2px 8px; border-radius:99px; font-size:0.7rem; font-weight:bold; margin-left:8px;">ENDED</span>';

                        return `
                        <div class="doc-item" style="flex-direction: column; align-items: stretch; margin-bottom: 10px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                                <div class="file-name" style="display:flex; align-items:center;">
                                    ${escapeHtml(data.email || 'Unknown')} ${statusBadge}
                                </div>
                            </div>
                            <div id="liveChat-${data.id}" style="max-height: 150px; overflow-y: auto; background: var(--bg-soft); padding: 8px; border-radius: 8px; margin-bottom: 8px;">
                                ${chatHTML || '<div class="muted small">No messages yet.</div>'}
                            </div>
                            ${data.active ? `
                            <div class="file-actions" style="width: 100%;">
                                <input type="text" id="injectQ-${data.id}" placeholder="Type hidden prompt or reply..." style="flex: 1; padding: 8px; font-size: 0.8rem; margin-right: 8px;" />
                                <button class="btn primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="injectLiveQuestion('${data.id}')">Send</button>
                            </div>` : ''}
                        </div>`;
                    }).join('');

                    // Restore inputs and scroll chats to bottom
                    docs.forEach(d => {
                        const inp = document.getElementById('injectQ-' + d.id);
                        if (inp && currentInputs[d.id]) inp.value = currentInputs[d.id];
                        
                        const chatContainer = document.getElementById('liveChat-' + d.id);
                        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
                    });
                }

                /* ============================================================
                TEXT EXTRACTION & INDEXING
                ============================================================ */
                async function extractText(file) {
                const ext = file.name.split('.').pop().toLowerCase();
                if (['txt', 'md', 'markdown', 'csv', 'json'].includes(ext)) return await file.text();
                if (ext === 'pdf') return await extractPdf(file);
                if (ext === 'docx') return await extractDocx(file);
                throw new Error(`Unsupported file type: .${ext}`);
                }
                async function extractPdf(file) {
                const buf = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map((it) => it.str).join(' ') + '\n\n';
                }
                return text;
                }
                async function extractDocx(file) {
                const buf = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer: buf });
                return result.value || '';
                }

                function cleanText(t) {
                return t.replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
                }
                function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
                const clean = cleanText(text);
                if (!clean) return [];
                const sentences = clean.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
                const chunks = [];
                let buf = '';
                for (const s of sentences) {
                    if ((buf + ' ' + s).length <= size) {
                    buf += (buf ? ' ' : '') + s;
                    } else {
                    if (buf) chunks.push(buf);
                    if (s.length > size) {
                        for (let i = 0; i < s.length; i += size - overlap) chunks.push(s.slice(i, i + size));
                        buf = '';
                    } else {
                        const tail = buf.slice(-overlap);
                        buf = (tail ? tail + ' ' : '') + s;
                    }
                    }
                }
                if (buf) chunks.push(buf);
                return chunks.filter((c) => c.trim().length > 30);
                }

                const STOPWORDS = new Set((
                'a an the is are was were be been being of to in for on at by it its this that these those ' +
                'with from as we you he she they i me my our your their and or but not no if then than so ' +
                'about into over under such can could should would may might must will shall do does did ' +
                'have has had there here which who whom whose what when where why how all any some each ' +
                'more most other another also just only very too any'
                ).split(/\s+/));

                function tokenize(text) {
                return (text.toLowerCase().match(/[a-z][a-z0-9'-]{2,}/g) || []).filter((w) => !STOPWORDS.has(w));
                }
                function computeIdf(chunks) {
                const df = {};
                chunks.forEach((c) => {
                    new Set(tokenize(c.text)).forEach((t) => { df[t] = (df[t] || 0) + 1; });
                });
                const N = chunks.length || 1;
                const idf = {};
                Object.keys(df).forEach((t) => { idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1; });
                return idf;
                }
                function scoreChunk(queryTokens, chunk, idf) {
                const tokens = tokenize(chunk.text);
                if (!tokens.length) return 0;
                const tf = {};
                tokens.forEach((t) => { tf[t] = (tf[t] || 0) + 1; });
                let score = 0;
                for (const q of queryTokens) if (tf[q]) score += tf[q] * (idf[q] || 1);
                return score / Math.sqrt(tokens.length + 1);
                }
                function retrieve(query, k = TOP_K, opts = {}) {
                if (!state.chunks.length) return [];
                const queryTokens = tokenize(query);
                if (!queryTokens.length) return [];
                return state.chunks
                    .filter((c) => !opts.docId || c.docId === opts.docId)
                    .map((c) => ({ chunk: c, score: scoreChunk(queryTokens, c, state.idf) }))
                    .filter((s) => s.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, k);
                }

                /* ============================================================
                KNOWLEDGE BASE
                ============================================================ */
                async function reloadKB() {
                if (!firebaseReady) return;
                try {
                    const [documents, chunks] = await Promise.all([
                    dbGetAll(STORE_DOCS),
                    dbGetAll(STORE_CHUNKS),
                    ]);
                    state.documents = documents;
                    state.chunks    = chunks;
                    state.idf       = computeIdf(chunks);
                    renderKBStatus();
                    renderDocs();
                    renderKB();
                } catch (err) {
                    console.error('reloadKB failed:', err);
                    toast('Failed to load knowledge base: ' + err.message, 'err');
                }
                }
                function renderKBStatus() {
                const el = $('#kbStatus');
                if (!state.chunks.length) {
                    el.textContent = 'No documents indexed';
                    el.classList.remove('ready');
                    return;
                }
                const d = state.documents.length, c = state.chunks.length;
                el.textContent = `${d} doc${d === 1 ? '' : 's'} · ${c} chunks`;
                el.classList.add('ready');
                }

                /* ============================================================
                ADMIN — UPLOAD + MEMBERS
                ============================================================ */
                function initAdmin() {
                const dz = $('#dropzone');
                const input = $('#fileInput');
                const browseBtn = $('#browseBtn');

                browseBtn.addEventListener('click', (e) => { e.stopPropagation(); input.click(); });
                dz.addEventListener('click', (e) => { if (e.target.closest('.link')) return; input.click(); });
                input.addEventListener('change', () => {
                    if (input.files.length) handleFiles(input.files);
                    input.value = '';
                });

                ['dragenter', 'dragover'].forEach((ev) =>
                    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('dragover'); })
                );
                ['dragleave', 'drop'].forEach((ev) =>
                    dz.addEventListener(ev, (e) => {
                    e.preventDefault();
                    if (ev === 'dragleave' && e.relatedTarget && dz.contains(e.relatedTarget)) return;
                    dz.classList.remove('dragover');
                    })
                );
                dz.addEventListener('drop', (e) => {
                    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
                });

                $('#clearAllBtn').addEventListener('click', async () => {
                    if (!state.documents.length && !state.chunks.length) {
                    toast('Knowledge base is already empty.', 'warn');
                    return;
                    }
                    if (!confirm('Delete all indexed documents and chunks? This cannot be undone.')) return;
                    await dbClear(STORE_DOCS);
                    await dbClear(STORE_CHUNKS);
                    await reloadKB();
                    toast('Knowledge base cleared.', 'ok');
                });

                $('#createMemberBtn').addEventListener('click', async () => {
                    const statusEl = $('#memberStatus');
                    statusEl.textContent = '';
                    const u = $('#newMemberUser').value.trim();
                    const p = $('#newMemberPass').value;
                    try {
                    await createMemberAccount(u, p);
                    $('#newMemberUser').value = '';
                    $('#newMemberPass').value = '';
                    statusEl.textContent = `✓ Member "${u}" created.`;
                    setTimeout(() => { statusEl.textContent = ''; }, 2600);
                    await renderMemberList();
                    toast('Member account created.', 'ok');
                    } catch (e) {
                    statusEl.textContent = '⚠ ' + e.message;
                    }
                });
                }

                async function handleFiles(files) {
                if (!firebaseReady) { toast('Firebase not ready.', 'err'); return; }
                const statusEl = $('#uploadStatus');
                statusEl.className = 'status-line busy';
                statusEl.textContent = `Processing ${files.length} file(s)…`;

                let ok = 0, fail = 0;
                const accepted = ['pdf', 'docx', 'txt', 'md', 'markdown', 'csv', 'json'];

                for (const file of files) {
                    const ext = file.name.split('.').pop().toLowerCase();
                    if (!accepted.includes(ext)) {
                    fail++;
                    toast(`Unsupported file: ${file.name}`, 'err');
                    continue;
                    }
                    try {
                    statusEl.textContent = `Extracting text from ${file.name}…`;
                    const raw = await extractText(file);
                    const chunks = chunkText(raw);
                    if (!chunks.length) {
                        fail++;
                        toast(`No usable text found in ${file.name}`, 'warn');
                        continue;
                    }
                    statusEl.textContent = `Uploading ${file.name} (${chunks.length} chunks)…`;

                    const docId = await dbAdd(STORE_DOCS, {
                        name: file.name,
                        size: file.size,
                        type: ext,
                        uploadedAt: Date.now(),
                        chunkCount: chunks.length,
                        charCount: raw.length,
                        uploadedBy: state.auth.currentUser?.username || 'unknown',
                    });

                    await dbAddMany(STORE_CHUNKS, chunks.map((text, i) => ({
                        docId, index: i, text, source: file.name,
                    })));

                    ok++;
                    } catch (err) {
                    console.error(err);
                    fail++;
                    toast(`Failed to process ${file.name}: ${err.message}`, 'err');
                    }
                }

                await reloadKB();
                if (ok && !fail) { statusEl.className = 'status-line ok'; statusEl.textContent = `✓ Indexed ${ok} document(s).`; }
                else if (ok && fail) { statusEl.className = 'status-line warn'; statusEl.textContent = `Indexed ${ok}, failed ${fail}.`; }
                else { statusEl.className = 'status-line err'; statusEl.textContent = `All ${fail} upload(s) failed.`; }
                }

                function renderDocs() {
                const list = $('#docList');
                list.innerHTML = '';
                if (!state.documents.length) {
                    list.innerHTML = `<div class="empty-state">No documents yet. Upload your thesis above to begin.</div>`;
                    return;
                }
                state.documents
                    .slice()
                    .sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0))
                    .forEach((doc) => {
                    const ext = doc.type || 'txt';
                    const item = document.createElement('div');
                    item.className = 'doc-item';
                    item.innerHTML = `
                        <div class="file-icon ${ext}">${ext.toUpperCase()}</div>
                        <div class="file-meta">
                        <div class="file-name">${escapeHtml(doc.name)}</div>
                        <div class="file-sub">${doc.chunkCount} chunks · ${fmtBytes(doc.size || 0)} · ${new Date(doc.uploadedAt || 0).toLocaleString()}</div>
                        </div>
                        <div class="file-actions">
                        <button class="icon-btn" title="Delete" data-del="${doc.id}">✕</button>
                        </div>
                    `;
                    list.appendChild(item);
                    });

                $$('[data-del]', list).forEach((btn) => {
                    btn.addEventListener('click', async () => {
                    const id = btn.dataset.del;
                    if (!confirm('Delete this document and its chunks?')) return;
                    try {
                        await dbDeleteByIndex(STORE_CHUNKS, 'docId', id);
                        await dbDelete(STORE_DOCS, id);
                        await reloadKB();
                        toast('Document deleted.', 'ok');
                    } catch (e) {
                        toast('Delete failed: ' + e.message, 'err');
                    }
                    });
                });
                }

                /* ============================================================
                SETTINGS
                ============================================================ */
                function loadSettings() {
                try {
                    const raw = localStorage.getItem(SETTINGS_KEY);
                    if (raw) Object.assign(state.settings, JSON.parse(raw));
                } catch {}
                $('#useLLM').checked = !!state.settings.useLLM;
                $('#llmProvider').value = state.settings.provider || 'openai';
                $('#endpoint').value = state.settings.endpoint || '';
                $('#model').value    = state.settings.model || '';
                $('#apiKey').value   = state.settings.apiKey || '';
                if ($('#fallbackApiKey')) $('#fallbackApiKey').value = state.settings.fallbackApiKey || '';
                }

                /* Load AI settings from Firestore in real-time so members instantly get the Admin's key. */
                function loadSettingsFromDB() {
                if (!firebaseReady) return;
                
                // Unsubscribe from any previous listener to prevent duplicates
                if (window.unsubscribeSettings) window.unsubscribeSettings();

                window.unsubscribeSettings = db.collection(STORE_SETTINGS).doc('global').onSnapshot(snap => {
                    if (snap.exists) {
                        Object.assign(state.settings, snap.data());
                        // Refresh the localStorage cache so the next boot is instant
                        localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
                    }
                    // Sync the UI (safe to run even for members who don't see the Admin tab)
                    if ($('#useLLM')) $('#useLLM').checked = !!state.settings.useLLM;
                    if ($('#llmProvider')) $('#llmProvider').value = state.settings.provider || 'openai';
                    if ($('#endpoint')) $('#endpoint').value = state.settings.endpoint || '';
                    if ($('#model')) $('#model').value    = state.settings.model || '';
                    if ($('#apiKey')) $('#apiKey').value   = state.settings.apiKey || '';
                    if ($('#fallbackApiKey')) $('#fallbackApiKey').value = state.settings.fallbackApiKey || '';
                    
                    updateStartHint();
                }, err => {
                    console.error('Failed to load settings from DB:', err);
                });
                }
                function initSettings() {
                const PROVIDER_DEFAULTS = {
                    openai: {
                    endpoint: 'https://api.openai.com/v1/chat/completions',
                    model: 'gpt-4o-mini',
                    placeholderKey: 'sk-...',
                    },
                    groq: {
                    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
                    model: 'llama-3.3-70b-versatile',
                    placeholderKey: 'gsk_...',
                    },
                    gemini: {
                    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
                    model: 'gemini-3.5-flash',
                    placeholderKey: 'AIza...',
                    },
                };

                $('#llmProvider').addEventListener('change', () => {
                    const p = $('#llmProvider').value;
                    const d = PROVIDER_DEFAULTS[p];
                    if (d) {
                    $('#endpoint').value = d.endpoint;
                    $('#model').value = d.model;
                    $('#apiKey').placeholder = d.placeholderKey;
                    }
                });

                $('#saveSettings').addEventListener('click', async () => {
                    state.settings.useLLM   = $('#useLLM').checked;
                    state.settings.provider = $('#llmProvider').value;
                    state.settings.endpoint = $('#endpoint').value.trim();
                    state.settings.model    = $('#model').value.trim();
                    state.settings.apiKey   = $('#apiKey').value.trim();
                    if ($('#fallbackApiKey')) state.settings.fallbackApiKey = $('#fallbackApiKey').value.trim();

                    // Always cache locally first so the UI stays in sync even if the DB write fails
                    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));

                    const s = $('#settingsStatus');
                    s.textContent = 'Saving to database…';

                    try {
                        await db.collection(STORE_SETTINGS).doc('global').set(state.settings);
                        s.textContent = 'Saved to DB ✓';
                        setTimeout(() => { s.textContent = ''; }, 2200);
                        toast('AI settings saved to database.', 'ok');
                    } catch (err) {
                        console.error('Failed to save settings to DB:', err);
                        s.textContent = '⚠ DB save failed — cached locally only';
                        toast('DB save failed (cached locally): ' + err.message, 'err');
                    }
                    updateStartHint();
                });
                }

                /* ============================================================
                EXAMINER PICKER
                ============================================================ */
                function initExaminerPicker() {
                const picker = $('#examinerPicker');
                picker.innerHTML = '';
                EXAMINERS.forEach((ex) => {
                    const el = document.createElement('div');
                    el.className = 'examiner' + (state.selectedExaminers.has(ex.id) ? ' selected' : '');
                    el.dataset.id = ex.id;
                    el.innerHTML = `
                    <div class="avatar">${ex.avatar}</div>
                    <div class="meta">
                        <div class="name">${escapeHtml(ex.name)}</div>
                        <div class="role">${escapeHtml(ex.role)}</div>
                    </div>
                    `;
                    el.addEventListener('click', () => {
                    if (state.selectedExaminers.has(ex.id)) {
                        if (state.selectedExaminers.size === 1) {
                        toast('You need at least one examiner.', 'warn');
                        return;
                        }
                        state.selectedExaminers.delete(ex.id);
                        el.classList.remove('selected');
                    } else {
                        state.selectedExaminers.add(ex.id);
                        el.classList.add('selected');
                    }
                    updateStartHint();
                    });
                    picker.appendChild(el);
                });
                updateStartHint();
                }

                function updateStartHint() {
                const hint = $('#startHint');
                const hasDocs = state.chunks.length > 0;
                const hasLLM = state.settings.useLLM && state.settings.apiKey;
                const btn = $('#startBtn');
                if (!hasDocs) { hint.textContent = 'Upload a document in the Admin tab first.'; btn.disabled = true; return; }
                if (!hasLLM) { hint.textContent = 'Enable and configure the LLM in Admin → AI Engine Settings first.'; btn.disabled = true; return; }
                btn.disabled = false;
                hint.textContent = `${state.chunks.length} indexed chunks ready · LLM active.`;
                }




                /* ============================================================
                OPTIONAL LLM
                ============================================================ */
                async function llmGenerateQuestion(examiner, chunkText, chapters = []) {
                if (!state.settings.useLLM || !state.settings.apiKey) {
                    throw new Error('LLM is not configured. Ask the Admin to save the API key.');
                }
                const chapterCtx = chapters.length ? `Focus the question on content relevant to: ${chapters.join(', ')}. ` : '';
                const system = `You are an academic thesis panelist specializing in ${examiner.role}. ` +
                    `${chapterCtx}` +
                    `Based on the provided text, ask ONE helpful but specific question. ` +
                    `The project uses Vanilla JS, Python, Firestore, Vercel, and AI APIs (Gemini/Groq). ` +
                    `Rules for your question:\n` +
                    `1. Be conversational and easy to understand.\n` +
                    `2. Focus on the ARCHITECTURE and TECH STACK choices (e.g., why they chose Vercel, how Firestore handles offline syncing, why Vanilla JS instead of React, how the AI fallback works).\n` +
                    `3. You may ask about the CURRENT PROBLEM or problem statement the study addresses (e.g., "What specific operational pain led to this system?").\n` +
                    `4. Do NOT ask them to write code, explain syntax, or explain specific lines of programming logic.\n` +
                    `5. Base it STRICTLY on a specific detail from the text.\n` +
                    `6. Ask only ONE thing at a time.\n` +
                    `7. Keep it under 35 words.\n` +
                    `8. You may ask in English or Tagalog.\n` +
                    `Return ONLY the question text.`;
                const user = `THESIS EXCERPT:\n"""${chunkText.slice(0, 3000)}"""\n\n` +
                    `Based on this excerpt, write a specific defense question related to ${examiner.role}.`;
                const reply = await callLLM(system, user, 400); // Increased tokens
                if (!reply) throw new Error('The AI returned an empty response.');
                
                const cleanQuestion = reply.trim().replace(/^["']|["']$/g, '');
                if (cleanQuestion.length < 15) {
                    throw new Error('AI returned an invalid or too-short question: "' + cleanQuestion + '"');
                }
                return cleanQuestion;
                }

                async function llmEvaluateAnswer(question, answer, chunkText) {
                if (!state.settings.useLLM || !state.settings.apiKey) {
                    throw new Error('LLM is not configured. Ask the Admin to save the API key.');
                }
                const system = `You are a strict but fair thesis defense panelist. ` +
                    `You must evaluate the student's answer STRICTLY based on the provided thesis excerpts. ` +
                    `The thesis is about a POS system using Vanilla JS, Python, Firestore, and Gemini/Groq. ` +
                    `Focus on evaluating their conceptual understanding of the tech stack and architecture, NOT code syntax. ` +
                    `If the student invents facts, contradicts the excerpts, or gives vague generic answers instead of specific architectural justifications from their own document, penalize the score heavily. ` +
                    `The student may answer in English, Tagalog, or Taglish. Understand the answer regardless of language. ` +
                    `Provide your feedback (strengths, improvements, verdict) in the SAME language the student used. ` +
                    `If the score is below 70, you MUST provide the correct, complete answer based strictly on the excerpts in the "correctAnswer" field. ` +
                    `Return STRICT JSON only, no markdown: {"score": <0-100>, "strengths": [..], "improvements": [..], "verdict": "<one sentence>", "correctAnswer": "<string>"}`;
                const user = `QUESTION: ${question}\n\nTHESIS EXCERPTS:\n"""${chunkText.slice(0, 3000)}"""\n\n` +
                    `STUDENT ANSWER:\n"""${answer.slice(0, 1000)}"""\n\n` +
                    `Score the answer from 0 to 100 based on: relevance to the question, accuracy compared to the excerpts, completeness, and defense quality.`;
                const reply = await callLLM(system, user, 1500); // Increased to 1500 to prevent truncated JSON
                if (!reply) throw new Error('AI returned an empty evaluation response.');
                
                try {
                    // Extract JSON robustly in case the AI wraps it in markdown or adds text
                    const rawJson = reply.replace(/```json/gi, '').replace(/```/g, '').trim();
                    const start = rawJson.indexOf('{');
                    const end = rawJson.lastIndexOf('}');
                    if (start === -1 || end === -1) throw new Error('No JSON object found in AI response.');
                    
                    const jsonStr = rawJson.substring(start, end + 1);
                    const json = JSON.parse(jsonStr);
                    
                    if (typeof json.score !== 'number') throw new Error('AI returned JSON without a numeric score.');
                    return {
                    score: Math.max(0, Math.min(100, json.score)),
                    strengths: Array.isArray(json.strengths) ? json.strengths.slice(0, 4) : [],
                    improvements: Array.isArray(json.improvements) ? json.improvements.slice(0, 4) : [],
                    verdict: json.verdict || '',
                    correctAnswer: json.correctAnswer || '',
                    source: 'llm',
                    };
                } catch (err) { 
                    console.error('JSON Parse Error:', err, 'Raw reply:', reply);
                    // Fallback instead of crashing if the AI still manages to send bad JSON
                    return {
                        score: 0,
                        strengths: [],
                        improvements: ['The AI evaluation response was malformed. Please try again.'],
                        verdict: 'Evaluation parsing failed.',
                        correctAnswer: '',
                        source: 'parse_error'
                    };
                }
                }

                async function callLLM(system, user, maxTokens = 300) {
                const { endpoint, model, apiKey, fallbackApiKey } = state.settings;
                if (!endpoint || !apiKey) throw new Error('LLM endpoint or API key is missing. Ask the Admin to save the settings.');

                // --- PRIMARY PROVIDER ATTEMPT ---
                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                        body: JSON.stringify({
                            model: model || 'gpt-4o-mini',
                            temperature: 0.6,
                            max_tokens: maxTokens,
                            messages: [
                                { role: 'system', content: system },
                                { role: 'user', content: user },
                            ],
                        }),
                    });
                    
                    if (!res.ok) { 
                        const errText = await res.text();
                        throw new Error(`Primary API Error ${res.status}: ${errText}`);
                    }
                    
                    const data = await res.json();
                    const content = data?.choices?.[0]?.message?.content;
                    
                    if (!content || content.trim() === '') {
                        console.warn('Raw primary API response:', JSON.stringify(data, null, 2));
                        throw new Error(`Primary AI returned empty text.`);
                    }
                    
                    return content;
                } catch (err) { 
                    console.warn('Primary LLM failed, attempting Groq fallback...', err); 
                    
                    // If no fallback key exists, throw the original error
                    if (!fallbackApiKey) throw err; 
                }

                // --- GROQ FALLBACK ATTEMPT ---
                try {
                    console.log('Using Groq fallback...');
                    const fallbackEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
                    const fallbackModel = 'llama-3.3-70b-versatile';

                    const res = await fetch(fallbackEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${fallbackApiKey}` },
                        body: JSON.stringify({
                            model: fallbackModel,
                            temperature: 0.6,
                            max_tokens: maxTokens,
                            messages: [
                                { role: 'system', content: system },
                                { role: 'user', content: user },
                            ],
                        }),
                    });

                    if (!res.ok) { 
                        const errText = await res.text();
                        throw new Error(`Groq Fallback Error ${res.status}: ${errText}`);
                    }

                    const data = await res.json();
                    const content = data?.choices?.[0]?.message?.content;
                    
                    if (!content || content.trim() === '') {
                        throw new Error('Groq fallback returned empty text.');
                    }

                    toast('Primary AI failed. Switched to Groq fallback.', 'warn');
                    return content;

                } catch (fallbackErr) {
                    console.error('Groq fallback failed:', fallbackErr);
                    throw new Error(`Both primary and fallback LLMs failed. ${fallbackErr.message}`);
                }
                }

                /* ============================================================
                DEFENSE SESSION
                ============================================================ */
                function initStartButton() {
                $('#startBtn').addEventListener('click', startSession);
                }

                async function appendNewQuestion() {
                    const s = state.session;
                    if (!s) return;

                    if (!state.settings.useLLM || !state.settings.apiKey) {
                        console.warn('LLM not configured — cannot generate questions.');
                        return;
                    }

                    const qIndex = s.questions.length;
                    const ex = EXAMINERS[qIndex % EXAMINERS.length];

                    // Build retrieval context from the examiner's focus area
                    const contextQuery = ex.focus.join(' ');
                    const bestMatches = retrieve(contextQuery, 3);
                    const contextText = bestMatches.length
                        ? bestMatches.map(m => m.chunk.text).join('\n\n---\n\n')
                        : (state.chunks[0]?.text || '');

                    let question = null;
                    try {
                        question = await llmGenerateQuestion(ex, contextText, s.chapters || []);
                    } catch (e) {
                        console.warn('LLM generation failed', e);
                        toast('LLM Generation Error: ' + e.message, 'err'); // <-- Show the exact error
                    }

                    if (!question || question.length < 10) {
                        console.warn('LLM returned no usable question.');
                        question = `Could you explain the core methodology or technical implementation related to ${ex.role} in your system?`;
                    }

                    const newQ = {
                        examiner: ex,
                        question,
                        chunk: { text: contextText },
                        keyword: ''
                    };
                    s.questions.push(newQ);

                    // If the user is currently looking at this question, refresh UI safely
                    if (s.index === qIndex && s.phase === 'question') {
                        const draft = $('#answerInput') ? $('#answerInput').value : '';
                        renderSession();
                        if ($('#answerInput') && draft) $('#answerInput').value = draft;
                    }
                }

                function listenForLeaderLive(liveId) {
                    if (state.session.unsubscribeLive) state.session.unsubscribeLive();
                    if (!state.session.seenLiveMsgs) state.session.seenLiveMsgs = new Set();
                    
                    state.session.unsubscribeLive = db.collection(STORE_LIVE).doc(liveId).onSnapshot(async doc => {
                        if (!doc.exists) return;
                        const data = doc.data();
                        const chat = data.chat || [];
                        
                        const newMsgs = chat.filter(m => m.sender === 'leader' && !state.session.seenLiveMsgs.has(m.id));
                        if (newMsgs.length > 0) {
                            for (const msg of newMsgs) {
                                state.session.seenLiveMsgs.add(msg.id);
                                
                                let finalQuestion = msg.text;
                                // Hide the leader's raw prompt by refining it with AI if available
                                if (state.settings.useLLM && state.settings.apiKey) {
                                    const ex = { name: 'Dr. Cruz', role: 'Technical', avatar: '💻' };
                                    const contextText = retrieve(msg.text, 3).map(m => m.chunk.text).join('\n\n---\n\n') || state.chunks[0]?.text || '';
                                    const refined = await llmGenerateQuestion(ex, contextText, []);
                                    if (refined) finalQuestion = refined;
                                }
                                
                                const newQ = {
                                    examiner: { id: 'hidden', name: 'Panelist', role: 'Urgent Follow-up', avatar: '🧑‍🏫' },
                                    question: finalQuestion,
                                    chunk: state.chunks[0] || { text: 'Live question' },
                                    keyword: 'custom'
                                };
                                
                                // Prioritize: insert the leader's question right after the current one
                                const insertIndex = Math.min(state.session.index + 1, state.session.questions.length);
                                state.session.questions.splice(insertIndex, 0, newQ);
                            }
                            toast('👑 The Leader has a follow-up question for you!', 'warn');
                            
                            // Save draft answer before re-rendering
                            const draft = $('#answerInput') ? $('#answerInput').value : '';
                            renderSession();
                            if ($('#answerInput') && draft) $('#answerInput').value = draft;
                        }
                    });
                }

                window.injectLiveQuestion = async (docId) => {
                    const input = document.getElementById('injectQ-' + docId);
                    if (!input || !input.value.trim()) return;
                    
                    // Prevent double-clicks
                    const btn = input.nextElementSibling;
                    if (btn) btn.disabled = true;

                    await db.collection(STORE_LIVE).doc(docId).update({
                        chat: firebase.firestore.FieldValue.arrayUnion({
                            id: Date.now().toString() + Math.random().toString(),
                            sender: 'leader',
                            text: input.value.trim(),
                            timestamp: Date.now()
                        })
                    }).catch(e => console.warn(e));
                    
                    input.value = '';
                    if (btn) btn.disabled = false;
                    toast('Reply sent!', 'ok');
                };

                async function startSession() {
                if (!state.chunks.length) { toast('Upload a document first.', 'warn'); return; }
                if (!state.settings.useLLM || !state.settings.apiKey) {
                    toast('Enable and configure the LLM in Admin → AI Engine Settings first.', 'err');
                    return;
                }

                const timePerQ = 180;
                const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4'];

                state.session = {
                    timePerQ, chapters,
                    index: 0, questions: [], results: [],
                    usedChunkIds: new Set(),
                    startTime: Date.now(),
                    timerHandle: null, timerRemaining: 0,
                    phase: 'question', current: null,
                    liveId: null, unsubscribeLive: null, lastInjectedAt: 0,
                    totalScore: 0, answeredCount: 0
                };

                // Create a live session for the leader to monitor
                try {
                    // Mark any previous active sessions by this user as inactive to prevent duplicate "LIVE" states
                    const oldSnap = await db.collection(STORE_LIVE)
                        .where('uid', '==', state.auth.currentUser.uid)
                        .where('active', '==', true)
                        .get();
                    if (!oldSnap.empty) {
                        const batch = db.batch();
                        oldSnap.forEach(d => batch.update(d.ref, { active: false }));
                        await batch.commit();
                    }

                    state.session.liveId = await dbAdd(STORE_LIVE, {
                        uid: state.auth.currentUser.uid,
                        email: state.auth.currentUser.username,
                        active: true,
                        createdAt: Date.now(),
                        expireAt: firebase.firestore.Timestamp.fromMillis(Date.now() + LIVE_TTL_MS),
                        chat: [] // Initialize chat array
                    });
                    listenForLeaderLive(state.session.liveId);

                    // If the student closes the tab, mark the session as ENDED automatically
                    window.addEventListener('beforeunload', () => {
                        if (state.session?.liveId) {
                            db.collection(STORE_LIVE).doc(state.session.liveId).update({ active: false }).catch(() => {});
                        }
                    });
                } catch (e) { console.warn('Live sync failed', e); }

                toast('Generating first questions…', 'info');
                await appendNewQuestion();
                await appendNewQuestion();

                $('#setupPanel').classList.add('hidden');
                $('#sessionPanel').classList.remove('hidden');
                renderSession();
                }

                function endSessionTimer() {
                if (state.session?.timerHandle) {
                    clearInterval(state.session.timerHandle);
                    state.session.timerHandle = null;
                }
                }
                function beginTimer() {
                if (!state.session) return;
                endSessionTimer();
                const { timePerQ } = state.session;
                if (!timePerQ) return;
                state.session.timerRemaining = timePerQ;
                updateTimerDisplay();
                state.session.timerHandle = setInterval(() => {
                    if (!state.session) return endSessionTimer();
                    state.session.timerRemaining--;
                    updateTimerDisplay();
                    if (state.session.timerRemaining <= 0) { endSessionTimer(); autoSubmitAnswer(); }
                }, 1000);
                }
                function updateTimerDisplay() {
                const el = $('#timer');
                if (!el || !state.session) return;
                const { timePerQ, timerRemaining } = state.session;
                if (!timePerQ) { el.classList.add('hidden'); return; }
                el.classList.remove('hidden');
                const m = Math.floor(timerRemaining / 60);
                const s = timerRemaining % 60;
                el.textContent = `⏱ ${m}:${String(s).padStart(2, '0')}`;
                el.classList.toggle('warn', timerRemaining <= 60 && timerRemaining > 20);
                el.classList.toggle('danger', timerRemaining <= 20);
                }

                function renderSession() {
                const panel = $('#sessionPanel');
                const s = state.session;
                if (!s) return;
                if (s.phase === 'summary') { renderSummary(panel); return; }

                const current = s.index + 1;
                const avg = s.answeredCount > 0 ? Math.round(s.totalScore / s.answeredCount) : 0;
                const pct = avg; // The progress bar now represents the average score

                let chatHistoryHTML = '';

                s.results.forEach((r) => {
                    chatHistoryHTML += `
                    <div class="chat-msg examiner">
                        <div class="msg-avatar">${r.examiner.avatar}</div>
                        <div>
                        <div class="msg-sender">${escapeHtml(r.examiner.name)}</div>
                        <div class="msg-bubble">${escapeHtml(r.question)}</div>
                        </div>
                    </div>
                    <div class="chat-msg user">
                        <div class="msg-avatar">You</div>
                        <div>
                        <div class="msg-sender">You</div>
                        <div class="msg-bubble">${escapeHtml(r.answer || '(Skipped)')}</div>
                        </div>
                    </div>
                    <div class="chat-feedback">
                        <div class="feedback ${r.result.score >= 70 ? 'good' : r.result.score >= 45 ? 'mid' : 'bad'}" style="padding: 10px 16px; margin-top: 0;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div class="score-ring" style="width: 40px; height: 40px; font-size: 0.85rem;" >
                                <b>${r.result.score}</b>
                            </div>
                            <div class="verdict" style="font-size: 0.85rem;">${escapeHtml(r.result.verdict || '')}</div>
                        </div>
                        </div>
                    </div>
                    `;
                });

                const item = s.questions[s.index];

                if (s.phase === 'question') {
                    const ex = item.examiner;
                    chatHistoryHTML += `
                    <div class="chat-msg examiner">
                        <div class="msg-avatar">${ex.avatar}</div>
                        <div>
                        <div class="msg-sender">${escapeHtml(ex.name)} · ${escapeHtml(ex.role)}</div>
                        <div class="msg-bubble">${escapeHtml(item.question)}</div>
                        </div>
                    </div>
                    `;
                }

                let feedbackHTML = '';
                if (s.phase === 'feedback') {
                    const result = s.lastResult;
                    const strengths = (result.strengths || []).map((str) => `<li>${escapeHtml(str)}</li>`).join('');
                    const improvements = (result.improvements || []).map((str) => `<li>${escapeHtml(str)}</li>`).join('');
                    
                    feedbackHTML = `
                    <div class="chat-feedback">
                        <div class="feedback ${result.score >= 70 ? 'good' : result.score >= 45 ? 'mid' : 'bad'}">
                        <div class="feedback-head">
                            <div class="score-ring" style="--pct:${result.score}%"><b>${result.score}</b></div>
                            <div>
                            <h4>${result.score >= 70 ? 'Strong answer' : result.score >= 45 ? 'Needs work' : 'Weak answer'}</h4>
                            <div class="verdict">${escapeHtml(result.verdict || '')}</div>
                            </div>
                        </div>
                        ${strengths ? `<div class="fb-section"><div class="fb-title">Strengths</div><ul>${strengths}</ul></div>` : ''}
                        ${improvements ? `<div class="fb-section"><div class="fb-title">Improve</div><ul>${improvements}</ul></div>` : ''}
                        ${(result.score < 70 && result.correctAnswer) ? `
                        <div class="fb-section">
                            <div class="fb-title" style="color: var(--accent);">True Answer (From PDF)</div>
                            <div style="font-size:0.88rem; color:var(--text); background:var(--bg-soft); padding:12px; border-radius:8px; border-left:3px solid var(--accent); line-height: 1.5; margin-top: 4px;">
                                ${escapeHtml(result.correctAnswer)}
                            </div>
                        </div>` : ''}
                        <div class="session-actions" style="margin-top: 16px; padding-top: 16px;">
                            <button class="btn primary" id="nextBtn">Next Question →</button>
                            <button class="btn danger" id="endBtn2">End Defense</button>
                        </div>
                        </div>
                    </div>
                    `;
                }

                let inputHTML = '';
                if (s.phase === 'question') {
                    inputHTML = `
                    <div class="chat-input-area">
                        <textarea id="answerInput" placeholder="Type your defense answer here..."></textarea>
                        <button class="btn ghost" id="skipBtn" title="Skip (counts as 0)">Skip</button>
                        <button class="btn danger" id="endBtn">End Defense</button>
                        <button class="btn primary" id="submitAnswer">Send</button>
                    </div>
                    `;
                }

                panel.innerHTML = `
                    <div class="session-header">
                    <h2>Defense in progress</h2>
                    <span class="q-counter">Question ${current}</span>
                    <div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
                    <span class="q-counter" style="color:var(--accent); font-weight:bold;">Avg Score: ${avg}</span>
                    <div class="timer ${s.timePerQ ? '' : 'hidden'}" id="timer">⏱ --:--</div>
                    </div>
                    <div class="chat-container">
                    <div class="chat-messages" id="chatMessages">
                        ${chatHistoryHTML}
                        ${feedbackHTML}
                    </div>
                    ${inputHTML}
                    </div>
                `;

                const chatMsgs = $('#chatMessages');
                if (chatMsgs) chatMsgs.scrollTop = chatMsgs.scrollHeight;

                if (s.phase === 'feedback') {
                    $('#nextBtn')?.addEventListener('click', nextQuestion);
                    $('#endBtn2')?.addEventListener('click', confirmEnd);
                    return;
                }

                const ta = $('#answerInput');
                if (ta) {
                    ta.focus();
                    ta.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        submitAnswer();
                    }
                    });
                }

                $('#submitAnswer')?.addEventListener('click', submitAnswer);
                $('#skipBtn')?.addEventListener('click', () => {
                    if (!confirm('Skip this question? It will count as a zero.')) return;
                    endSessionTimer();
                    s.lastResult = { score: 0, strengths: [], improvements: ['You skipped this question.'], verdict: 'Skipped.', source: 'local' };
                    s.results.push({ examiner: item.examiner, question: item.question, answer: '', result: s.lastResult, chunk: item.chunk });
                    s.totalScore += 0;
                    s.answeredCount++;
                    s.phase = 'feedback';
                    renderSession();
                });
                $('#endBtn')?.addEventListener('click', confirmEnd);
                beginTimer();
                }

                async function submitAnswer() {
                const s = state.session;
                if (!s || s.phase !== 'question') return;
                const ta = $('#answerInput');
                const answer = ta ? ta.value.trim() : '';
                if (!answer) { toast('Please write an answer or skip.', 'warn'); return; }

                endSessionTimer();
                const item = s.questions[s.index];
                const btn = $('#submitAnswer');
                if (btn) { btn.disabled = true; btn.textContent = 'Evaluating…'; }

                // Retrieve top 3 relevant chunks from the PDF based on the question AND the answer
                const queryTokens = item.question + ' ' + answer;
                const bestMatches = retrieve(queryTokens, 3);
                const contextText = bestMatches.length 
                    ? bestMatches.map(m => m.chunk.text).join('\n\n---\n\n') 
                    : item.chunk.text;

                let result = null;
                if (state.settings.useLLM && state.settings.apiKey) {
                    try {
                        result = await llmEvaluateAnswer(item.question, answer, contextText);
                    } catch (err) {
                        toast('LLM Error: ' + err.message, 'err');
                        console.error('Evaluation Error:', err);
                    }
                }
                if (!result) {
                    result = {
                        score: 0,
                        strengths: [],
                        improvements: ['LLM evaluation unavailable — check your API settings or key.'],
                        verdict: 'Evaluation could not be completed.',
                        correctAnswer: '',
                        source: 'fallback'
                    };
                }

                s.lastResult = result;
                s.results.push({ examiner: item.examiner, question: item.question, answer, result, chunk: item.chunk });
                s.totalScore += result.score;
                s.answeredCount++;
                
                // Send to Leader
                if (s.liveId) {
                    db.collection(STORE_LIVE).doc(s.liveId).update({
                        chat: firebase.firestore.FieldValue.arrayUnion({
                            id: Date.now().toString() + Math.random().toString(),
                            sender: 'member',
                            text: answer,
                            timestamp: Date.now()
                        })
                    }).catch(e => console.warn(e));
                }
                
                s.phase = 'feedback';
                renderSession();
                }

                function autoSubmitAnswer() {
                const s = state.session;
                if (!s || s.phase !== 'question') return;
                toast('Time is up — answer submitted as is.', 'warn');
                submitAnswer();
                }
                function nextQuestion() {
                const s = state.session;
                if (!s) return;
                s.index++;
                s.phase = 'question';
                s.lastResult = null;

                // Buffer logic: Keep at least 3 questions ahead so there is no loading delay
                if (s.index >= s.questions.length - 3) {
                    appendNewQuestion();
                }

                renderSession();
                }
                function confirmEnd() {
                if (!confirm('End the defense now and see your results?')) return;
                endSessionTimer();
                if (!state.session) return;
                state.session.phase = 'summary';

                // Mark as inactive immediately when they end the defense
                if (state.session.liveId) {
                    db.collection(STORE_LIVE).doc(state.session.liveId).update({
                        active: false,
                        expireAt: firebase.firestore.Timestamp.fromMillis(Date.now() + LIVE_TTL_MS)
                    }).catch(() => {});
                }

                renderSession();
                }

                /* ============================================================
                SUMMARY
                ============================================================ */
                function renderSummary(panel) {
                const s = state.session;
                const results = s.results;
                if (!results.length) {
                    panel.innerHTML = `
                    <h2>Defense ended</h2>
                    <p class="muted">No answers were submitted.</p>
                    <button class="btn primary" id="restartBtn">Start a new defense</button>
                    `;
                    $('#restartBtn').addEventListener('click', restartSession);
                    return;
                }

                const avg = Math.round(results.reduce((a, r) => a + r.result.score, 0) / results.length);
                const best = results.reduce((a, r) => (r.result.score > a.result.score ? r : a));
                const worst = results.reduce((a, r) => (r.result.score < a.result.score ? r : a));

                const verdict =
                    avg >= 80 ? 'Passed with distinction — panel-ready.' :
                    avg >= 65 ? 'Passed — with minor defense refinements needed.' :
                    avg >= 50 ? 'Conditional pass — significant defense practice required.' :
                    'Not ready — work on depth, evidence, and structure.';

                const byExaminer = {};
                results.forEach((r) => {
                    const k = r.examiner.id;
                    if (!byExaminer[k]) byExaminer[k] = { examiner: r.examiner, scores: [] };
                    byExaminer[k].scores.push(r.result.score);
                });

                const breakdownHTML = Object.values(byExaminer).map(({ examiner, scores }) => {
                    const a = Math.round(scores.reduce((x, y) => x + y, 0) / scores.length);
                    return `<div class="stat-card">
                    <div class="stat-value">${examiner.avatar} ${a}</div>
                    <div class="stat-label">${escapeHtml(examiner.role)}</div>
                    </div>`;
                }).join('');

                const detailHTML = results.map((r, i) => `
                    <div class="chunk" style="border-left:3px solid ${r.result.score >= 70 ? 'var(--success)' : r.result.score >= 45 ? 'var(--warn)' : 'var(--danger)'};">
                    <div class="chunk-head">
                        <span class="chunk-source">Q${i + 1} · ${escapeHtml(r.examiner.role)}</span>
                        <span class="chunk-score">${r.result.score}/100</span>
                    </div>
                    <div style="font-weight:600;margin-bottom:6px;">${escapeHtml(r.question)}</div>
                    <div class="chunk-text" style="margin-bottom: 8px;">Your Answer: ${escapeHtml(truncate(r.answer || '(skipped)', 240))}</div>
                    ${(r.result.score < 70 && r.result.correctAnswer) ? `
                        <div style="font-size:0.82rem; color:var(--text); background:var(--panel-2); padding:10px; border-radius:6px; border-left:2px solid var(--accent);">
                            <strong style="color:var(--accent);">True Answer:</strong> ${escapeHtml(r.result.correctAnswer)}
                        </div>
                    ` : ''}
                    </div>
                `).join('');

                panel.innerHTML = `
                    <div class="summary-hero">
                    <div class="big-score">${avg}</div>
                    <div class="verdict-line">${verdict}</div>
                    <p class="muted small" style="margin-top:8px;">
                        ${results.length} question${results.length === 1 ? '' : 's'}
                    </p>
                    </div>
                    <div class="summary-grid">
                    <div class="stat-card"><div class="stat-value">${best.result.score}</div><div class="stat-label">Best answer</div></div>
                    <div class="stat-card"><div class="stat-value">${worst.result.score}</div><div class="stat-label">Weakest answer</div></div>
                    ${breakdownHTML}
                    </div>
                    <h3>Question-by-question</h3>
                    <div class="chunk-list">${detailHTML}</div>
                    <div class="session-actions">
                    <button class="btn primary" id="restartBtn">New Defense</button>
                    <button class="btn ghost" id="reviewKB">Review Knowledge Base</button>
                    </div>
                `;

                $('#restartBtn').addEventListener('click', restartSession);
                $('#reviewKB').addEventListener('click', () => {
                    $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.view === 'kb'));
                    $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-kb'));
                    renderKB();
                });
                }

                function restartSession() {
                endSessionTimer();
                if (state.session?.unsubscribeLive) state.session.unsubscribeLive();
                if (state.session?.liveId) {
                    // Mark inactive and extend the TTL clock by one more hour so the
                    // leader can still review it in the monitor after the defense ends.
                    db.collection(STORE_LIVE).doc(state.session.liveId).update({
                        active: false,
                        expireAt: firebase.firestore.Timestamp.fromMillis(Date.now() + LIVE_TTL_MS)
                    }).catch(() => {});
                }
                if (window.liveMonitorUnsubscribe) { window.liveMonitorUnsubscribe(); window.liveMonitorUnsubscribe = null; }
                state.session = null;
                $('#setupPanel').classList.remove('hidden');
                $('#sessionPanel').classList.add('hidden');
                $('#sessionPanel').innerHTML = '';
                updateStartHint();
                }

                /* ============================================================
                KNOWLEDGE BASE VIEW
                ============================================================ */
                function initKBView() {
                const input = $('#kbSearch');
                const doSearch = () => {
                    const q = input.value.trim();
                    if (!q) { renderKB(); return; }
                    renderKBResults(retrieve(q, 10), q);
                };
                $('#kbSearchBtn').addEventListener('click', doSearch);
                input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
                $('#kbResetBtn').addEventListener('click', () => { input.value = ''; renderKB(); });
                }

                function renderKB() {
                const resultsEl = $('#kbResults');
                if (!resultsEl) return;
                if (!state.chunks.length) {
                    resultsEl.innerHTML = `<div class="empty-state">Knowledge base is empty. Upload documents in the <strong>Admin</strong> tab.</div>`;
                    return;
                }
                const sample = state.chunks.slice(0, 6);
                resultsEl.innerHTML = `
                    <p class="muted small" style="margin-bottom:12px;">
                    Showing ${sample.length} of ${state.chunks.length} chunks. Search above to test retrieval.
                    </p>
                    ${sample.map((c) => chunkCardHTML(c)).join('')}
                `;
                }
                function renderKBResults(results, query) {
                const resultsEl = $('#kbResults');
                if (!results.length) {
                    resultsEl.innerHTML = `<div class="empty-state">No matching chunks for "<strong>${escapeHtml(query)}</strong>".</div>`;
                    return;
                }
                resultsEl.innerHTML = results.map((r) => chunkCardHTML(r.chunk, r.score, query)).join('');
                }
                function chunkCardHTML(chunk, score, query) {
                let text = escapeHtml(chunk.text);
                if (query) {
                    tokenize(query).slice(0, 6).forEach((t) => {
                    const re = new RegExp(`\\b(${escapeRegex(t)}[a-z]*)`, 'gi');
                    text = text.replace(re, '<mark>$1</mark>');
                    });
                }
                return `
                    <div class="chunk">
                    <div class="chunk-head">
                        <span class="chunk-source">${escapeHtml(chunk.source || 'unknown')} · #${(chunk.index ?? 0) + 1}</span>
                        ${typeof score === 'number' ? `<span class="chunk-score">score ${score.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="chunk-text">${text}</div>
                    </div>
                `;
                }

                /* ============================================================
                BOOT
                ============================================================ */
                async function boot() {
                initTabs();
                initAdmin();
                initSettings();
                loadSettings();
                initStartButton();
                initKBView();

                // 1. Initialize Firebase
                const ok = initFirebase();
                if (!ok) {
                    showConfigError();
                    return;
                }

                // 2. Initialize Auth Listener
                initAuth();
                }

                function showConfigError(msg) {
                const overlay = $('#authOverlay');
                if (!overlay) return;
                overlay.hidden = false;
                $('#authSetup').classList.add('hidden');
                const login = $('#authLogin');
                login.classList.remove('hidden');
                login.innerHTML = `
                    <div class="auth-brand">
                    <span class="logo">◈</span>
                    <span>Defense<span class="accent">Sim</span></span>
                    </div>
                    <h1>Firebase not configured</h1>
                    <p class="muted">
                    Open <code>app.js</code> and paste your Firebase project config into the
                    <code>firebaseConfig</code> object at the top of the file.
                    </p>
                    <p class="muted small">Firebase Console → Project settings ⚙ → Your apps.</p>
                    ${msg ? `<div class="auth-error">${escapeHtml(msg)}</div>` : ''}
                `;
                }

                if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', boot);
                } else {
                boot();
                }