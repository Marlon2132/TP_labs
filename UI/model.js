'use strict';

(function (global) {

    const INITIAL_BOOKINGS = [
        { id:'b1', description:'Свадьба Ивановых в зале «Ривьера»', createdAt:'2026-01-10T10:00:00', author:'Иванов Иван Иванович', photoLink:'', clientName:'Иванов Иван Иванович', clientPhone:'+375291111111', bookingDate:'2026-08-15T17:00:00', guestsCount:50, restaurant:'Ривьера', hallType:'Банкетный зал', decoration:'Дизайнерское', tableNumber:5, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты'], designer:true, director:true, music:true, photographer:true, status:'Подтверждено', isVip:true, discount:10, totalPrice:3500, courierId:'' },
        { id:'b2', description:'Корпоратив «Зимняя сказка»', createdAt:'2026-01-12T14:30:00', author:'Сидорова Анна Сергеевна', photoLink:'', clientName:'Сидорова Анна Сергеевна', clientPhone:'+375293333333', bookingDate:'2026-12-20T19:00:00', guestsCount:80, restaurant:'Времена года', hallType:'VIP-зал', decoration:'Тематическое', tableNumber:12, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Напитки'], designer:false, director:true, music:true, photographer:true, status:'Ожидает', isVip:false, discount:0, totalPrice:4200, courierId:'' },
        { id:'b3', description:'Юбилей 50 лет', createdAt:'2026-01-15T09:00:00', author:'Иванов Иван Иванович', photoLink:'', clientName:'Иванов Иван Иванович', clientPhone:'+375291111111', bookingDate:'2026-09-10T18:00:00', guestsCount:40, restaurant:'Приозёрный', hallType:'Банкетный зал', decoration:'Стандартное', tableNumber:3, deliveryType:'В зале', deliveryAddress:'', menu:['Горячее','Десерты'], designer:false, director:false, music:true, photographer:false, status:'Подтверждено', isVip:true, discount:10, totalPrice:2400, courierId:'' },
        { id:'b4', description:'Свадьба Петровых', createdAt:'2025-12-20T16:00:00', author:'Сидорова Анна Сергеевна', photoLink:'', clientName:'Петров Пётр Петрович', clientPhone:'+375292222222', bookingDate:'2026-07-05T16:00:00', guestsCount:60, restaurant:'Ривьера', hallType:'Банкетный зал', decoration:'Дизайнерское', tableNumber:8, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты','Напитки'], designer:true, director:true, music:true, photographer:true, status:'Завершено', isVip:false, discount:0, totalPrice:3800, courierId:'' },
        { id:'b5', description:'Корпоратив IT-компании', createdAt:'2026-01-18T11:00:00', author:'Администратор Системы', photoLink:'', clientName:'ООО «АйтиСофт»', clientPhone:'+375294444444', bookingDate:'2026-11-01T19:00:00', guestsCount:100, restaurant:'Времена года', hallType:'VIP-зал', decoration:'Тематическое', tableNumber:1, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Напитки'], designer:true, director:true, music:true, photographer:false, status:'Отменено', isVip:false, discount:0, totalPrice:5000, courierId:'' },
        { id:'b6', description:'Доставка банкета на дом', createdAt:'2026-01-20T08:30:00', author:'Иванов Иван Иванович', photoLink:'', clientName:'Иванов Иван Иванович', clientPhone:'+375291111111', bookingDate:'2026-08-01T14:00:00', guestsCount:20, restaurant:'Приозёрный', hallType:'Банкетный зал', decoration:'Стандартное', tableNumber:0, deliveryType:'Доставка', deliveryAddress:'ул. Ленина, д. 10, кв. 5', menu:['Салаты','Горячее'], designer:false, director:false, music:false, photographer:false, status:'Доставлен', isVip:true, discount:10, totalPrice:1500, courierId:'u3' },
        { id:'b7', description:'Детский день рождения', createdAt:'2026-01-22T13:00:00', author:'Сидорова Анна Сергеевна', photoLink:'', clientName:'Сидорова Анна Сергеевна', clientPhone:'+375293333333', bookingDate:'2026-09-25T12:00:00', guestsCount:15, restaurant:'Ривьера', hallType:'Летняя веранда', decoration:'Тематическое', tableNumber:2, deliveryType:'В зале', deliveryAddress:'', menu:['Десерты','Напитки'], designer:true, director:true, music:true, photographer:true, status:'Подтверждено', isVip:false, discount:0, totalPrice:1800, courierId:'' },
        { id:'b8', description:'Свадьба Кузнецовых', createdAt:'2026-01-25T10:00:00', author:'Иванов Иван Иванович', photoLink:'', clientName:'Кузнецов Алексей', clientPhone:'+375295555555', bookingDate:'2026-10-10T17:00:00', guestsCount:70, restaurant:'Времена года', hallType:'Банкетный зал', decoration:'Дизайнерское', tableNumber:6, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты'], designer:true, director:true, music:true, photographer:true, status:'Ожидает', isVip:true, discount:15, totalPrice:4600, courierId:'' },
        { id:'b9', description:'Доставка корпоративного обеда', createdAt:'2026-01-28T09:00:00', author:'Администратор Системы', photoLink:'', clientName:'ООО «Ромашка»', clientPhone:'+375296666666', bookingDate:'2026-08-20T13:00:00', guestsCount:30, restaurant:'Приозёрный', hallType:'Банкетный зал', decoration:'Стандартное', tableNumber:0, deliveryType:'Доставка', deliveryAddress:'пр-т Независимости, д. 22, оф. 301', menu:['Салаты','Горячее','Напитки'], designer:false, director:false, music:false, photographer:false, status:'Доставлен', isVip:false, discount:0, totalPrice:2100, courierId:'u3' },
        { id:'b10', description:'Свадьба Смирновых', createdAt:'2026-02-01T11:00:00', author:'Сидорова Анна Сергеевна', photoLink:'', clientName:'Смирнов Дмитрий', clientPhone:'+375297777777', bookingDate:'2026-11-15T16:00:00', guestsCount:55, restaurant:'Ривьера', hallType:'Банкетный зал', decoration:'Дизайнерское', tableNumber:7, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты','Напитки'], designer:true, director:true, music:true, photographer:true, status:'Подтверждено', isVip:true, discount:10, totalPrice:4100, courierId:'' },
        { id:'b11', description:'Юбилей 60 лет', createdAt:'2026-02-03T15:00:00', author:'Иванов Иван Иванович', photoLink:'', clientName:'Иванов Иван Иванович', clientPhone:'+375291111111', bookingDate:'2026-07-20T17:00:00', guestsCount:45, restaurant:'Времена года', hallType:'VIP-зал', decoration:'Стандартное', tableNumber:4, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты'], designer:false, director:false, music:true, photographer:false, status:'Завершено', isVip:true, discount:10, totalPrice:2700, courierId:'' },
        { id:'b12', description:'Свадьба Морозовых', createdAt:'2026-02-05T10:30:00', author:'Администратор Системы', photoLink:'', clientName:'Морозова Елена', clientPhone:'+375298888888', bookingDate:'2026-12-05T16:00:00', guestsCount:65, restaurant:'Приозёрный', hallType:'Банкетный зал', decoration:'Дизайнерское', tableNumber:9, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты','Напитки'], designer:true, director:true, music:true, photographer:true, status:'Ожидает', isVip:false, discount:0, totalPrice:4400, courierId:'' },
        { id:'b13', description:'Доставка свадебного торта и блюд', createdAt:'2026-02-07T12:00:00', author:'Сидорова Анна Сергеевна', photoLink:'', clientName:'Сидорова Анна Сергеевна', clientPhone:'+375293333333', bookingDate:'2026-08-28T11:00:00', guestsCount:25, restaurant:'Ривьера', hallType:'Банкетный зал', decoration:'Дизайнерское', tableNumber:0, deliveryType:'Доставка', deliveryAddress:'ул. Победы, д. 5, кв. 12', menu:['Десерты','Напитки'], designer:false, director:false, music:false, photographer:false, status:'Доставлен', isVip:false, discount:0, totalPrice:1700, courierId:'u3' },
        { id:'b14', description:'Свадьба Волковых', createdAt:'2026-02-10T09:00:00', author:'Иванов Иван Иванович', photoLink:'', clientName:'Волков Сергей', clientPhone:'+375299999999', bookingDate:'2026-10-25T16:00:00', guestsCount:60, restaurant:'Времена года', hallType:'Банкетный зал', decoration:'Дизайнерское', tableNumber:10, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты'], designer:true, director:true, music:true, photographer:true, status:'Подтверждено', isVip:true, discount:15, totalPrice:4500, courierId:'' },
        { id:'b15', description:'Выпускной вечер', createdAt:'2026-02-12T14:00:00', author:'Сидорова Анна Сергеевна', photoLink:'', clientName:'Гимназия №1', clientPhone:'+375291010101', bookingDate:'2026-06-25T18:00:00', guestsCount:120, restaurant:'Приозёрный', hallType:'Банкетный зал', decoration:'Тематическое', tableNumber:11, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты','Напитки'], designer:true, director:true, music:true, photographer:true, status:'Ожидает', isVip:false, discount:0, totalPrice:6200, courierId:'' },
        { id:'b16', description:'Юбилей семейный', createdAt:'2026-02-15T11:00:00', author:'Иванов Иван Иванович', photoLink:'', clientName:'Иванов Иван Иванович', clientPhone:'+375291111111', bookingDate:'2026-06-15T15:00:00', guestsCount:30, restaurant:'Ривьера', hallType:'Летняя веранда', decoration:'Стандартное', tableNumber:1, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее'], designer:false, director:false, music:true, photographer:false, status:'Завершено', isVip:true, discount:10, totalPrice:1900, courierId:'' },
        { id:'b17', description:'Доставка блюд на корпоратив', createdAt:'2026-02-18T10:00:00', author:'Администратор Системы', photoLink:'', clientName:'ИП «Сидоров»', clientPhone:'+375292121212', bookingDate:'2026-09-05T12:00:00', guestsCount:40, restaurant:'Времена года', hallType:'Банкетный зал', decoration:'Стандартное', tableNumber:0, deliveryType:'Доставка', deliveryAddress:'ул. Гагарина, д. 15', menu:['Салаты','Горячее','Напитки'], designer:false, director:false, music:false, photographer:false, status:'Доставлен', isVip:false, discount:0, totalPrice:2300, courierId:'u3' },
        { id:'b18', description:'Свадьба Орловых', createdAt:'2026-02-20T13:00:00', author:'Сидорова Анна Сергеевна', photoLink:'', clientName:'Орлова Мария', clientPhone:'+375293131313', bookingDate:'2026-11-22T16:00:00', guestsCount:50, restaurant:'Приозёрный', hallType:'Банкетный зал', decoration:'Дизайнерское', tableNumber:5, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты'], designer:true, director:true, music:true, photographer:true, status:'Подтверждено', isVip:false, discount:0, totalPrice:3600, courierId:'' },
        { id:'b19', description:'Свадьба молодых', createdAt:'2026-02-22T09:30:00', author:'Иванов Иван Иванович', photoLink:'', clientName:'Новиков Артём', clientPhone:'+375294141414', bookingDate:'2026-12-12T15:00:00', guestsCount:45, restaurant:'Ривьера', hallType:'Банкетный зал', decoration:'Тематическое', tableNumber:3, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты','Напитки'], designer:true, director:true, music:true, photographer:true, status:'Ожидает', isVip:true, discount:10, totalPrice:3400, courierId:'' },
        { id:'b20', description:'Юбилей директора', createdAt:'2026-02-25T10:00:00', author:'Администратор Системы', photoLink:'', clientName:'ООО «Вектор»', clientPhone:'+375295151515', bookingDate:'2026-10-18T18:00:00', guestsCount:35, restaurant:'Времена года', hallType:'VIP-зал', decoration:'Дизайнерское', tableNumber:2, deliveryType:'В зале', deliveryAddress:'', menu:['Салаты','Горячее','Десерты','Напитки'], designer:true, director:false, music:true, photographer:true, status:'Отменено', isVip:false, discount:0, totalPrice:2800, courierId:'' }
    ];

    const INITIAL_USERS = [
        { id:'u1', login:'admin',    password:'admin',    fio:'Администратор Системы',   phone:'+375290000000', role:'admin',   isVip:false, discount:0 },
        { id:'u2', login:'client',   password:'client',   fio:'Иванов Иван Иванович',    phone:'+375291111111', role:'client',  isVip:true,  discount:10 },
        { id:'u3', login:'courier',  password:'courier',  fio:'Петров Пётр Петрович',    phone:'+375292222222', role:'courier', isVip:false, discount:0 },
        { id:'u4', login:'client2',  password:'client2',  fio:'Сидорова Анна Сергеевна', phone:'+375293333333', role:'client',  isVip:false, discount:0 }
    ];

    class BookingList {
        #objs = [];
        #storageKey = 'torzhestva_bookings_v1';

        constructor(objs = []) {
            this.#objs = objs.map(o => this.#clone(o));
        }

        /* --- приватные --- */
        #clone(obj) { return JSON.parse(JSON.stringify(obj)); }

        #toDate(value) {
            if (value instanceof Date) return isNaN(value.getTime()) ? null : new Date(value.getTime());
            if (typeof value === 'string' || typeof value === 'number') {
                const d = new Date(value);
                return isNaN(d.getTime()) ? null : d;
            }
            return null;
        }

        #checkFormat(obj) {
            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
            if (typeof obj.id !== 'string' || obj.id.trim() === '') return false;
            if (typeof obj.description !== 'string' || obj.description.trim() === '') return false;
            if (obj.description.length >= 200) return false;
            if (!this.#toDate(obj.createdAt)) return false;
            if (typeof obj.author !== 'string' || obj.author.trim() === '') return false;
            if (obj.photoLink !== undefined && typeof obj.photoLink !== 'string') return false;
            return true;
        }

        #match(obj, f) {
            const dateKeys = ['createdAt', 'bookingDate'];
            const skipKeys = ['sortBy', 'sortOrder'];

            for (const [key, val] of Object.entries(f)) {
                if (skipKeys.includes(key)) continue;
                if (val === undefined || val === null || val === '') continue;

                /* Диапазоны XxxFrom / XxxTo */
                if (key.endsWith('From') || key.endsWith('To')) {
                    const base = key.replace(/From$|To$/, '');
                    if (dateKeys.includes(base)) {
                        const objD = this.#toDate(obj[base]);
                        if (!objD) return false;
                        const vD = this.#toDate(val);
                        if (!vD) return false;
                        if (key.endsWith('From')) {
                            if (objD.getTime() < vD.getTime()) return false;
                        } else {
                            if (typeof val === 'string' && val.length === 10) {
                                const next = new Date(vD);
                                next.setDate(next.getDate() + 1);
                                if (objD.getTime() >= next.getTime()) return false;
                            } else if (objD.getTime() > vD.getTime()) {
                                return false;
                            }
                        }
                    } else {
                        const objN = Number(obj[base]);
                        const vN   = Number(val);
                        if (key.endsWith('From') && objN < vN) return false;
                        if (key.endsWith('To')   && objN > vN) return false;
                    }
                    continue;
                }

                if (key === 'menu') {
                    const need = Array.isArray(val) ? val : [val];
                    const have = Array.isArray(obj.menu) ? obj.menu : [];
                    if (!need.every(m => have.includes(m))) return false;
                    continue;
                }

                if (dateKeys.includes(key)) {
                    const a = this.#toDate(obj[key]);
                    const b = this.#toDate(val);
                    if (!a || !b || a.getTime() !== b.getTime()) return false;
                    continue;
                }

                if (typeof obj[key] === 'boolean') {
                    if (Boolean(obj[key]) !== Boolean(val)) return false;
                    continue;
                }

                if (typeof obj[key] === 'number') {
                    if (Number(obj[key]) !== Number(val)) return false;
                    continue;
                }

                if (typeof obj[key] === 'string' && typeof val === 'string') {
                    if (!obj[key].toLowerCase().includes(val.toLowerCase())) return false;
                    continue;
                }

                if (obj[key] !== val) return false;
            }
            return true;
        }

        #sort(list, sortBy, sortOrder) {
            const field = sortBy || 'createdAt';
            const dir   = sortOrder === 'asc' ? 1 : -1;
            const dateF = ['createdAt', 'bookingDate'];
            return list.sort((a, b) => {
                let va = a[field], vb = b[field];
                if (dateF.includes(field)) {
                    va = this.#toDate(va)?.getTime() || 0;
                    vb = this.#toDate(vb)?.getTime() || 0;
                    return (va - vb) * dir;
                }
                if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
                return String(va ?? '').localeCompare(String(vb ?? ''), 'ru') * dir;
            });
        }

        validateObj(obj) { return this.#checkFormat(obj); }

        getObjs(skip = 0, top = 10, filterConfig) {
            if (typeof skip !== 'number' || skip < 0 || !isFinite(skip)) skip = 0;
            if (typeof top  !== 'number' || top  < 0 || !isFinite(top))  top  = 10;

            let list = this.#objs.slice();
            let sortBy = 'createdAt', sortOrder = 'desc';
            if (filterConfig && typeof filterConfig === 'object') {
                list = list.filter(o => this.#match(o, filterConfig));
                if (filterConfig.sortBy)    sortBy    = filterConfig.sortBy;
                if (filterConfig.sortOrder) sortOrder = filterConfig.sortOrder;
            }
            list = this.#sort(list, sortBy, sortOrder);
            return list.slice(skip, skip + top).map(o => this.#clone(o));
        }

        getObj(id) {
            const o = this.#objs.find(x => x.id === id);
            return o ? this.#clone(o) : null;
        }

        addObj(obj) {
            if (!this.validateObj(obj)) return false;
            if (this.#objs.some(o => o.id === obj.id)) return false;
            this.#objs.push(this.#clone(obj));
            this.save();
            return true;
        }

        addAll(objs) {
            if (!Array.isArray(objs)) return [];
            const added = [];
            for (const o of objs) if (this.addObj(o)) added.push(this.#clone(o));
            return added;
        }

        editObj(id, changes) {
            if (!changes || typeof changes !== 'object' || Array.isArray(changes)) return false;
            const idx = this.#objs.findIndex(o => o.id === id);
            if (idx === -1) return false;

            const cleaned = {};
            for (const k of Object.keys(changes)) {
                if (k === 'id' || k === 'author' || k === 'createdAt') continue;
                cleaned[k] = changes[k];
            }
            const merged = { ...this.#objs[idx], ...cleaned };
            if (!this.#checkFormat(merged)) return false;

            this.#objs[idx] = merged;
            this.save();
            return true;
        }

        removeObj(id) {
            const idx = this.#objs.findIndex(o => o.id === id);
            if (idx === -1) return false;
            this.#objs.splice(idx, 1);
            this.save();
            return true;
        }

        clear()   { this.#objs = []; this.save(); }
        size()    { return this.#objs.length; }
        getAll()  { return this.#objs.map(o => this.#clone(o)); }

        save() {
            try { localStorage.setItem(this.#storageKey, JSON.stringify(this.#objs)); }
            catch (e) { console.warn('BookingList.save failed:', e); }
        }

        restore() {
            try {
                const raw = localStorage.getItem(this.#storageKey);
                if (!raw) return false;
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) return false;
                this.#objs = parsed.filter(o => this.#checkFormat(o)).map(o => this.#clone(o));
                return true;
            } catch (e) { console.warn('BookingList.restore failed:', e); return false; }
        }
    }

    class UsersCollection {
        #users = [];
        #storageKey = 'torzhestva_users_v1';

        constructor(users = []) {
            this.#users = users.map(u => ({ ...u }));
            if (!this.restore()) this.save();
        }

        getAll()      { return this.#users.map(u => ({ ...u })); }
        getById(id)   { const u = this.#users.find(x => x.id === id); return u ? { ...u } : null; }
        getByLogin(l) { const u = this.#users.find(x => x.login === l); return u ? { ...u } : null; }

        addUser(user) {
            if (!user || !user.id || !user.login) return false;
            if (this.#users.some(u => u.id === user.id || u.login === user.login)) return false;
            this.#users.push({ ...user });
            this.save();
            return true;
        }

        removeUser(id) {
            const idx = this.#users.findIndex(u => u.id === id);
            if (idx === -1) return false;
            this.#users.splice(idx, 1);
            this.save();
            return true;
        }

        editUser(id, changes) {
            const idx = this.#users.findIndex(u => u.id === id);
            if (idx === -1) return false;
            const { id: _ignore, ...rest } = changes;
            this.#users[idx] = { ...this.#users[idx], ...rest };
            this.save();
            return true;
        }

        save() {
            try { localStorage.setItem(this.#storageKey, JSON.stringify(this.#users)); }
            catch (e) { console.warn('UsersCollection.save failed:', e); }
        }

        restore() {
            try {
                const raw = localStorage.getItem(this.#storageKey);
                if (!raw) return false;
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) return false;
                this.#users = parsed;
                return true;
            } catch (e) { return false; }
        }
    }
    
    global.AppModels = { BookingList, UsersCollection, INITIAL_BOOKINGS, INITIAL_USERS };

})(window);