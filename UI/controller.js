'use strict';

(function () {

    const CURRENT_USER = null;

    const PAGE_SIZE = 10;

    const { BookingList, UsersCollection, INITIAL_BOOKINGS, INITIAL_USERS } = window.AppModels;
    const { View, escapeHtml } = window.AppView;

    const model = new BookingList();
    const users = new UsersCollection(INITIAL_USERS);
    const view  = new View();

    const state = {
        currentUser: null,
        filter: {},
        skip: 0
    };

    function init() {
        if (!model.restore()) {
            model.addAll(INITIAL_BOOKINGS);
            console.info('[init] Модель заполнена начальными данными (первый запуск).');
        } else {
            console.info(`[init] Модель восстановлена из localStorage (${model.size()} записей).`);
        }

        if (CURRENT_USER) {
            const u = users.getByLogin(CURRENT_USER.login);
            if (u && u.password === CURRENT_USER.password) state.currentUser = u;
        }

        bindEvents();
        renderAll();
        console.info('[App] Готов. Используйте window.App из консоли для тестирования.');
    }

    function renderAll() {
        view.renderHeader(state.currentUser);
        renderHome();
        renderCourier();
        renderAdmin();
    }

    function renderHome() {
        const total = model.getObjs(0, Number.MAX_SAFE_INTEGER, state.filter).length;
        const page  = model.getObjs(state.skip, PAGE_SIZE, state.filter);
        view.renderBookingList(page, state.currentUser);
        view.renderPagination(total, state.skip, PAGE_SIZE);
        view.renderCount(total);
        view.fillFilterOptions(model.getAll());
    }

    function renderCourier() {
        if (state.currentUser && state.currentUser.role === 'courier') {
            view.renderCourierList(model.getObjs(0, 100, { courierId: state.currentUser.id }));
        } else {
            view.renderCourierList([]);
        }
    }

    function renderAdmin() {
        if (state.currentUser && state.currentUser.role === 'admin') {
            view.renderAdminUsers(users.getAll());
        }
    }

    function showScreen(id) {
        if (id === 'admin'   && (!state.currentUser || state.currentUser.role !== 'admin'))   id = 'home';
        if (id === 'courier' && (!state.currentUser || state.currentUser.role !== 'courier')) id = 'home';
        if (id === 'booking' && !state.currentUser) id = 'login';
        view.showScreen(id);
        if (id === 'courier') renderCourier();
        if (id === 'admin')   renderAdmin();
    }

    function bindEvents() {

        document.addEventListener('click', e => {
            const act  = e.target.closest('[data-action="logout"]');
            if (act) { e.preventDefault(); doLogout(); return; }
            const link = e.target.closest('[data-nav]');
            if (link) { e.preventDefault(); showScreen(link.getAttribute('data-nav')); }
        });

        document.getElementById('login-form').addEventListener('submit', e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const login = String(fd.get('login') || '').trim();
            const pass  = String(fd.get('password') || '');
            const u = users.getByLogin(login);
            if (u && u.password === pass) {
                state.currentUser = u;
                state.skip = 0;
                state.filter = {};
                e.target.reset();
                const msg = e.target.querySelector('.form-message'); if (msg) msg.remove();
                renderAll();
                showScreen('home');
            } else {
                view.showMessage('login-form', 'Неверный логин или пароль', true);
            }
        });

        document.getElementById('show-register').addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('login-window').hidden    = true;
            document.getElementById('register-window').hidden = false;
        });
        document.getElementById('hide-register').addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('register-window').hidden = true;
            document.getElementById('login-window').hidden    = false;
        });

        document.getElementById('register-form').addEventListener('submit', e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const login = String(fd.get('login') || '').trim();
            const pass  = String(fd.get('password') || '');
            const fio   = String(fd.get('fio')    || '').trim();
            const phone = String(fd.get('phone')  || '').trim();

            if (!login || !pass || !fio) {
                view.showMessage('register-form', 'Заполните все обязательные поля', true);
                return;
            }
            if (users.getByLogin(login)) {
                view.showMessage('register-form', 'Логин уже занят', true);
                return;
            }
            const newUser = {
                id: 'u' + Date.now(),
                login, password: pass, fio, phone,
                role: 'client', isVip: false, discount: 0
            };
            if (users.addUser(newUser)) {
                state.currentUser = newUser;
                e.target.reset();
                document.getElementById('register-window').hidden = true;
                document.getElementById('login-window').hidden    = false;
                renderAll();
                showScreen('home');
            } else {
                view.showMessage('register-form', 'Ошибка регистрации', true);
            }
        });

        document.getElementById('search-form').addEventListener('submit', e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            state.filter = {};
            ['bookingDateFrom', 'bookingDateTo', 'status', 'restaurant', 'hallType',
             'decoration', 'deliveryType', 'guestsCountFrom', 'guestsCountTo',
             'sortBy', 'sortOrder'].forEach(k => {
                const v = fd.get(k);
                if (v !== null && v !== '') state.filter[k] = v;
            });
            state.skip = 0;
            renderHome();
        });

        document.getElementById('search-reset').addEventListener('click', () => {
            state.filter = {};
            state.skip = 0;
            document.getElementById('search-form').reset();
            renderHome();
        });

        document.getElementById('create-booking-btn').addEventListener('click', () => {
            if (!state.currentUser) { showScreen('login'); return; }
            view.resetBookingForm();
            document.getElementById('booking-status-group').hidden =
                state.currentUser.role !== 'admin';
            const f = document.getElementById('booking-form');
            f.querySelector('[name="clientName"]').value  = state.currentUser.fio;
            f.querySelector('[name="clientPhone"]').value = state.currentUser.phone || '';
            showScreen('booking');
        });

        document.getElementById('booking-form').addEventListener('submit', e => {
            e.preventDefault();
            handleBookingSubmit(e.target);
        });

        document.getElementById('booking-cancel').addEventListener('click', () => {
            view.resetBookingForm();
            showScreen('home');
        });

        document.getElementById('pagination').addEventListener('click', e => {
            const btn = e.target.closest('[data-skip]');
            if (!btn || btn.disabled) return;
            state.skip = parseInt(btn.getAttribute('data-skip'), 10) || 0;
            renderHome();
        });

        document.getElementById('bookings-list').addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');

            if (action === 'edit') {
                const b = model.getObj(id);
                if (!b || !state.currentUser) return;
                if (state.currentUser.role !== 'admin' &&
                    !(state.currentUser.role === 'client' && b.author === state.currentUser.fio)) return;
                view.fillBookingForm(b);
                document.getElementById('booking-status-group').hidden =
                    state.currentUser.role !== 'admin';
                showScreen('booking');
            } else if (action === 'delete') {
                if (!state.currentUser) return;
                if (state.currentUser.role !== 'admin') {
                    const b = model.getObj(id);
                    if (!b || b.author !== state.currentUser.fio) return;
                }
                if (confirm('Удалить бронирование?')) {
                    model.removeObj(id);
                    renderAll();
                }
            }
        });

        document.getElementById('courier-list').addEventListener('click', e => {
            const btn = e.target.closest('[data-action="deliver"]');
            if (!btn) return;
            model.editObj(btn.getAttribute('data-id'), { status: 'Доставлен' });
            renderCourier();
            renderHome();
        });

        document.getElementById('admin-add-user').addEventListener('click', () => {
            view.resetUserForm();
            document.getElementById('user-form').hidden = false;
        });
        document.getElementById('user-form-cancel').addEventListener('click', () => {
            document.getElementById('user-form').hidden = true;
        });

        document.getElementById('user-form').addEventListener('submit', e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            data.isVip    = data.isVip === 'on';
            data.discount = parseInt(data.discount, 10) || 0;
            if (data.id) {
                users.editUser(data.id, data);
            } else {
                data.id = 'u' + Date.now();
                users.addUser(data);
            }
            document.getElementById('user-form').hidden = true;
            renderAdmin();
        });

        document.getElementById('users-list').addEventListener('click', e => {
            const btn = e.target.closest('[data-user-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-user-action');
            const id = btn.getAttribute('data-id');
            if (action === 'edit') {
                const u = users.getById(id);
                if (u) { view.fillUserForm(u); document.getElementById('user-form').hidden = false; }
            } else if (action === 'delete') {
                if (confirm('Удалить пользователя?')) {
                    users.removeUser(id);
                    renderAdmin();
                }
            }
        });

        document.getElementById('report-form').addEventListener('submit', e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            view.renderReport(buildReport(fd.get('dateFrom'), fd.get('dateTo')));
        });

        /* --- hashchange --- */
        window.addEventListener('hashchange', () => {
            const id = (location.hash || '#home').replace('#', '');
            showScreen(id);
        });
    }

    function handleBookingSubmit(form) {
        if (!state.currentUser) {
            view.showMessage('booking-form', 'Необходимо войти', true);
            return;
        }
        if (state.currentUser.role !== 'client' && state.currentUser.role !== 'admin') {
            view.showMessage('booking-form', 'Недостаточно прав', true);
            return;
        }

        const fd = new FormData(form);
        const id = fd.get('id');
        const data = collectBookingData(fd);

        if (state.currentUser.role !== 'admin') delete data.status;

        if (!data.bookingDate) {
            view.showMessage('booking-form', 'Укажите дату и время', true);
            return;
        }
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 3);
        if (new Date(data.bookingDate) < minDate) {
            showError('Выбранное время бронирования менее чем через 3 дня от текущего момента.');
            return;
        }

        data.totalPrice = calculatePrice(data);

        let ok;
        if (id) {
            ok = model.editObj(id, data);
        } else {
            const newObj = {
                id: 'b' + Date.now(),
                description: data.description,
                createdAt: new Date().toISOString(),
                author: state.currentUser.fio,
                photoLink: data.photoLink || '',
                clientName: data.clientName,
                clientPhone: data.clientPhone,
                bookingDate: data.bookingDate,
                guestsCount: data.guestsCount,
                restaurant: data.restaurant,
                hallType: data.hallType,
                decoration: data.decoration,
                tableNumber: data.tableNumber,
                deliveryType: data.deliveryType,
                deliveryAddress: data.deliveryAddress,
                menu: data.menu,
                designer: data.designer,
                director: data.director,
                music: data.music,
                photographer: data.photographer,
                status: data.status || 'Ожидает',
                isVip: !!state.currentUser.isVip,
                discount: state.currentUser.discount || 0,
                totalPrice: data.totalPrice,
                courierId: data.deliveryType === 'Доставка' ? 'u3' : ''
            };
            ok = model.addObj(newObj);
        }

        if (ok) {
            view.resetBookingForm();
            state.skip = 0;
            renderAll();
            showScreen('home');
        } else {
            view.showMessage('booking-form', 'Ошибка сохранения. Проверьте поля.', true);
        }
    }

    function collectBookingData(fd) {
        return {
            description:     String(fd.get('description') || ''),
            clientName:      String(fd.get('clientName') || ''),
            clientPhone:     String(fd.get('clientPhone') || ''),
            photoLink:       String(fd.get('photoLink') || ''),
            bookingDate:     String(fd.get('bookingDate') || ''),
            guestsCount:     parseInt(fd.get('guestsCount'), 10) || 1,
            restaurant:      String(fd.get('restaurant') || ''),
            hallType:        String(fd.get('hallType') || ''),
            decoration:      String(fd.get('decoration') || ''),
            tableNumber:     parseInt(fd.get('tableNumber'), 10) || 0,
            deliveryType:    String(fd.get('deliveryType') || 'В зале'),
            deliveryAddress: String(fd.get('deliveryAddress') || ''),
            menu:            fd.getAll('menu'),
            designer:        fd.get('designer')     === 'on',
            director:        fd.get('director')     === 'on',
            music:           fd.get('music')        === 'on',
            photographer:    fd.get('photographer') === 'on',
            status:          String(fd.get('status') || 'Ожидает')
        };
    }

    function calculatePrice(d) {
        let base = 1000 + (d.guestsCount || 0) * 30;
        if (d.designer)     base += 500;
        if (d.director)     base += 400;
        if (d.music)        base += 300;
        if (d.photographer) base += 350;
        return base;
    }

    function buildReport(dateFrom, dateTo) {
        let list = model.getAll();
        if (dateFrom) {
            const from = new Date(dateFrom);
            list = list.filter(b => new Date(b.createdAt) >= from);
        }
        if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            list = list.filter(b => new Date(b.createdAt) <= to);
        }
        const byStatus = {}, byRestaurant = {}, byMenu = {};
        let total = 0;
        for (const b of list) {
            total += b.totalPrice || 0;
            byStatus[b.status]         = (byStatus[b.status]         || 0) + (b.totalPrice || 0);
            byRestaurant[b.restaurant] = (byRestaurant[b.restaurant] || 0) + (b.totalPrice || 0);
            for (const m of (b.menu || [])) {
                byMenu[m] = (byMenu[m] || 0) + b.guestsCount;
            }
        }
        return { count: list.length, total, byStatus, byRestaurant, byMenu };
    }

    function showError(message) {
        document.getElementById('error-message').textContent = message;
        showScreen('error');
    }

    function doLogout() {
        state.currentUser = null;
        state.filter = {};
        state.skip = 0;
        renderAll();
        showScreen('home');
    }

    window.App = {
        getObjs:     (skip, top, filter) => model.getObjs(skip, top, filter),
        getObj:      (id)                => model.getObj(id),
        addObj:      (obj) => { const ok = model.addObj(obj); if (ok) renderAll(); return ok; },
        editObj:     (id, obj) => { const ok = model.editObj(id, obj); if (ok) renderAll(); return ok; },
        removeObj:   (id) => { const ok = model.removeObj(id); if (ok) renderAll(); return ok; },
        getAll:      () => model.getAll(),
        size:        () => model.size(),
        validateObj: (o) => model.validateObj(o),
        clear:       () => { model.clear(); renderAll(); },

        login: (login, password) => {
            const u = users.getByLogin(login);
            if (u && u.password === password) {
                state.currentUser = u;
                renderAll();
                showScreen('home');
                return true;
            }
            return false;
        },
        logout: doLogout,
        setUser: (u) => { state.currentUser = u; renderAll(); },
        getState: () => ({
            currentUser: state.currentUser,
            filter: { ...state.filter },
            skip: state.skip
        }),

        dump: () => ({ bookings: model.getAll(), users: users.getAll() }),

        buildReport: (from, to) => buildReport(from, to),

        runTests: () => {
            console.group('=== BookingList: тесты ===');
            console.log('Всего записей:', model.size());
            console.log('getObjs(0, 3):', model.getObjs(0, 3));
            console.log('getObjs(10, 5):', model.getObjs(10, 5));
            console.log('getObjs(0, 10, {status:"Подтверждено"}):',
                model.getObjs(0, 10, { status: 'Подтверждено' }));
            console.log('getObjs(0, 5, {sortBy:"totalPrice", sortOrder:"desc"}):',
                model.getObjs(0, 5, { sortBy: 'totalPrice', sortOrder: 'desc' }));
            console.log('getObjs(0, 5, {guestsCountFrom:50, guestsCountTo:80}):',
                model.getObjs(0, 5, { guestsCountFrom: 50, guestsCountTo: 80 }));
            console.log('getObjs(0, 5, {menu:["Салаты"]}):',
                model.getObjs(0, 5, { menu: ['Салаты'] }));
            console.log('getObj("b1"):', model.getObj('b1'));
            console.log('validateObj(valid):',
                model.validateObj({ id:'t1', description:'test', createdAt:new Date(), author:'Tester' }));
            console.log('validateObj(invalid id):',
                model.validateObj({ id:'', description:'x', createdAt:new Date(), author:'T' }));
            console.log('validateObj(description >= 200):',
                model.validateObj({ id:'t2', description:'a'.repeat(250), createdAt:new Date(), author:'T' }));
            console.log('validateObj(invalid date):',
                model.validateObj({ id:'t3', description:'x', createdAt:'not-a-date', author:'T' }));
            console.log('addObj(valid):', model.addObj({
                id:'t_test', description:'Тестовая запись',
                createdAt: new Date().toISOString(), author:'Tester',
                clientName:'Tester', clientPhone:'+375000000000',
                bookingDate:'2027-01-01T12:00:00', guestsCount:10,
                restaurant:'Ривьера', hallType:'Банкетный зал', decoration:'Стандартное',
                tableNumber:1, deliveryType:'В зале', deliveryAddress:'',
                menu:[], designer:false, director:false, music:false, photographer:false,
                status:'Ожидает', isVip:false, discount:0, totalPrice:1300, courierId:''
            }));
            console.log('addObj(duplicate id):', model.addObj({
                id:'b1', description:'дубль',
                createdAt: new Date().toISOString(), author:'T'
            }));
            console.log('editObj("t_test", {description:"Изменено"}):',
                model.editObj('t_test', { description: 'Изменено' }));
            console.log('editObj("b1", {author:"HACK", ...}): (author и createdAt игнорируются)',
                model.editObj('b1', { author: 'HACK', createdAt: '1999-01-01', description: 'Изменённое' }));
            console.log('getObj("b1").author после попытки изменить:',
                model.getObj('b1').author);
            console.log('removeObj("t_test"):', model.removeObj('t_test'));
            console.log('removeObj("t_test") повторно:', model.removeObj('t_test'));
            console.log('ИТОГО после тестов:', model.size());
            renderAll();
            console.groupEnd();
        }
    };

    init();
})();