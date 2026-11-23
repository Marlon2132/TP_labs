'use strict';

(function (global) {

    function escapeHtml(str) {
        return String(str ?? '').replace(/[&<>"']/g, ch => ({
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
        })[ch]);
    }

    function formatDate(value) {
        const d = new Date(value);
        if (isNaN(d)) return '—';
        const pad = n => String(n).padStart(2, '0');
        return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    function toLocalInput(value) {
        const d = new Date(value);
        if (isNaN(d)) return '';
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    class View {

        showScreen(id) {
            document.querySelectorAll('.screen').forEach(s => {
                s.classList.toggle('active', s.id === id);
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        renderHeader(user) {
            const info = document.getElementById('user-info');
            const navAuth = document.getElementById('nav-auth');
            const navAdmin = document.getElementById('nav-admin');
            const navCourier = document.getElementById('nav-courier');
            const createBtn = document.getElementById('create-booking-btn');

            if (user) {
                info.innerHTML = `<span>${escapeHtml(user.fio)} <small>(${escapeHtml(user.role)})</small></span>
                                  <button type="button" class="btn btn-small btn-secondary" data-action="logout">Выйти</button>`;
                navAuth.textContent = 'Выйти';
                navAuth.removeAttribute('data-nav');
                navAuth.setAttribute('data-action', 'logout');
            } else {
                info.innerHTML = '';
                navAuth.textContent = 'Войти';
                navAuth.setAttribute('data-nav', 'login');
                navAuth.removeAttribute('data-action');
            }

            navAdmin.hidden   = !user || user.role !== 'admin';
            navCourier.hidden = !user || user.role !== 'courier';
            createBtn.hidden  = !user || (user.role !== 'client' && user.role !== 'admin');
        }

        renderBookingList(bookings, user) {
            const container = document.getElementById('bookings-list');
            if (!bookings || !bookings.length) {
                container.innerHTML = '<p class="message">Бронирования не найдены.</p>';
                return;
            }
            container.innerHTML = bookings.map(b => this.#bookingCard(b, user)).join('');
        }

        #bookingCard(b, user) {
            const canEdit = user && (user.role === 'admin' || (user.role === 'client' && b.author === user.fio));
            const actions = canEdit
                ? `<button type="button" class="btn btn-secondary btn-small" data-action="edit"   data-id="${escapeHtml(b.id)}">Ред.</button>
                   <button type="button" class="btn btn-danger    btn-small" data-action="delete" data-id="${escapeHtml(b.id)}">Удал.</button>`
                : '';
            return `<article class="card">
                <div class="card-info">
                    <h4>${escapeHtml(b.description)}</h4>
                    <p><b>Клиент:</b> ${escapeHtml(b.clientName)} | <b>Тел.:</b> ${escapeHtml(b.clientPhone)}</p>
                    <p><b>Ресторан:</b> ${escapeHtml(b.restaurant)} | <b>Зал:</b> ${escapeHtml(b.hallType)} | <b>Стол №</b>${b.tableNumber}</p>
                    <p><b>Дата:</b> ${formatDate(b.bookingDate)} | <b>Гостей:</b> ${b.guestsCount} | <b>${escapeHtml(b.deliveryType)}</b></p>
                    <p><b>Статус:</b> <span class="status ${this.#statusClass(b.status)}">${escapeHtml(b.status)}</span>
                       | <b>Стоимость:</b> ${b.totalPrice} BYN${b.isVip ? ' (VIP)' : ''}</p>
                </div>
                <div class="card-actions">${actions}</div>
            </article>`;
        }

        #statusClass(status) {
            if (status === 'Подтверждено' || status === 'Завершено' || status === 'Доставлен') return 'delivered';
            if (status === 'Отменено') return 'cancelled';
            return 'in-progress';
        }

        renderPagination(total, skip, pageSize) {
            const container = document.getElementById('pagination');
            const pages = Math.ceil(total / pageSize) || 1;
            if (pages <= 1) { container.innerHTML = ''; return; }

            const current = Math.floor(skip / pageSize);
            let html = `<button type="button" class="btn-page" data-skip="${Math.max(0, (current-1)*pageSize)}" ${current === 0 ? 'disabled' : ''}>Назад</button>`;
            for (let i = 0; i < pages; i++) {
                html += `<button type="button" class="btn-page ${i === current ? 'active-page' : ''}" data-skip="${i*pageSize}">${i+1}</button>`;
            }
            html += `<button type="button" class="btn-page" data-skip="${Math.min((current+1)*pageSize, (pages-1)*pageSize)}" ${current === pages-1 ? 'disabled' : ''}>Вперёд</button>`;
            container.innerHTML = html;
        }

        renderCount(total) {
            document.getElementById('bookings-count').textContent = `Найдено: ${total}`;
        }

        renderCourierList(bookings) {
            const container = document.getElementById('courier-list');
            if (!bookings || !bookings.length) {
                container.innerHTML = '<p class="message">Доставок нет.</p>';
                return;
            }
            container.innerHTML = bookings.map(b => `
                <div class="courier-item">
                    <div class="order-info">
                        <strong>Заказ #${escapeHtml(b.id)}</strong>
                        <p><b>Адрес:</b> ${escapeHtml(b.deliveryAddress || '—')}</p>
                        <p><b>Клиент:</b> ${escapeHtml(b.clientName)} (${escapeHtml(b.clientPhone)})</p>
                        <p><b>Статус:</b> <span class="status ${this.#statusClass(b.status)}">${escapeHtml(b.status)}</span></p>
                    </div>
                    ${b.status !== 'Доставлен' && b.status !== 'Завершено'
                        ? `<button type="button" class="btn btn-primary" data-action="deliver" data-id="${escapeHtml(b.id)}">Отметить «Доставлен»</button>`
                        : `<button type="button" class="btn btn-secondary" disabled>Доставлен</button>`}
                </div>`).join('');
        }

        renderAdminUsers(users) {
            const container = document.getElementById('users-list');
            const header = `<div class="user-list">
                <div class="user-row header-row">
                    <div>ID</div><div>ФИО</div><div>Логин / роль</div><div>Действия</div>
                </div>`;
            const rows = users.map(u => `
                <div class="user-row">
                    <div>${escapeHtml(u.id)}</div>
                    <div>${escapeHtml(u.fio)}<br><small>${escapeHtml(u.phone || '')}</small></div>
                    <div>${escapeHtml(u.login)} / ${escapeHtml(u.role)}</div>
                    <div>
                        <button type="button" class="btn-small btn-secondary" data-user-action="edit"   data-id="${escapeHtml(u.id)}">Ред.</button>
                        <button type="button" class="btn-small btn-danger"    data-user-action="delete" data-id="${escapeHtml(u.id)}">Удал.</button>
                    </div>
                </div>`).join('');
            container.innerHTML = header + rows + '</div>';
        }

        fillBookingForm(b) {
            const f = document.getElementById('booking-form');
            f.querySelector('[name="id"]').value              = b.id;
            f.querySelector('[name="description"]').value     = b.description;
            f.querySelector('[name="clientName"]').value      = b.clientName;
            f.querySelector('[name="clientPhone"]').value     = b.clientPhone;
            f.querySelector('[name="photoLink"]').value       = b.photoLink || '';
            f.querySelector('[name="bookingDate"]').value     = toLocalInput(b.bookingDate);
            f.querySelector('[name="guestsCount"]').value     = b.guestsCount;
            f.querySelector('[name="restaurant"]').value      = b.restaurant;
            f.querySelector('[name="hallType"]').value        = b.hallType;
            f.querySelector('[name="decoration"]').value      = b.decoration;
            f.querySelector('[name="tableNumber"]').value     = b.tableNumber;
            f.querySelector('[name="deliveryType"]').value    = b.deliveryType;
            f.querySelector('[name="deliveryAddress"]').value = b.deliveryAddress || '';
            f.querySelectorAll('[name="menu"]').forEach(cb => cb.checked = (b.menu || []).includes(cb.value));
            f.querySelector('[name="designer"]').checked      = !!b.designer;
            f.querySelector('[name="director"]').checked      = !!b.director;
            f.querySelector('[name="music"]').checked         = !!b.music;
            f.querySelector('[name="photographer"]').checked  = !!b.photographer;
            f.querySelector('[name="status"]').value          = b.status || 'Ожидает';
            document.getElementById('booking-title').textContent = 'Редактирование бронирования';
        }

        resetBookingForm() {
            const f = document.getElementById('booking-form');
            f.reset();
            f.querySelector('[name="id"]').value = '';
            document.getElementById('booking-title').textContent = 'Оформление бронирования';
            const msg = f.querySelector('.form-message'); if (msg) msg.remove();
        }

        fillUserForm(u) {
            const f = document.getElementById('user-form');
            f.querySelector('[name="id"]').value       = u.id;
            f.querySelector('[name="login"]').value    = u.login;
            f.querySelector('[name="password"]').value = u.password || '';
            f.querySelector('[name="fio"]').value      = u.fio;
            f.querySelector('[name="phone"]').value    = u.phone || '';
            f.querySelector('[name="role"]').value     = u.role;
            f.querySelector('[name="isVip"]').checked  = !!u.isVip;
            f.querySelector('[name="discount"]').value = u.discount || 0;
        }

        resetUserForm() {
            const f = document.getElementById('user-form');
            f.reset();
            f.querySelector('[name="id"]').value = '';
        }

        showMessage(formId, msg, isError = false) {
            const form = document.getElementById(formId);
            if (!form) return;
            let box = form.querySelector('.form-message');
            if (!box) {
                box = document.createElement('p');
                box.className = 'form-message';
                form.appendChild(box);
            }
            box.textContent = msg;
            box.classList.toggle('error', isError);
        }

        fillFilterOptions(bookings) {
            const select = document.getElementById('search-restaurant');
            const current = select.value;
            const unique = [...new Set(bookings.map(b => b.restaurant).filter(Boolean))];
            select.innerHTML = '<option value="">Все</option>' +
                unique.map(r => `<option>${escapeHtml(r)}</option>`).join('');
            select.value = current;
        }

        renderReport(data) {
            const c = document.getElementById('report-output');
            if (!data) { c.innerHTML = ''; return; }
            const statuses   = Object.entries(data.byStatus);
            const rests      = Object.entries(data.byRestaurant);
            const menuCounts = Object.entries(data.byMenu);
            c.innerHTML = `
                <div class="report-card">
                    <h3>Итого за период</h3>
                    <p><b>Броней:</b> ${data.count}</p>
                    <p><b>Общая выручка:</b> ${data.total} BYN</p>
                    <h4>По статусам:</h4>
                    ${statuses.length ? `<ul>${statuses.map(([k,v]) => `<li>${escapeHtml(k)}: <b>${v} BYN</b></li>`).join('')}</ul>` : '<p class="hint">—</p>'}
                    <h4>По ресторанам:</h4>
                    ${rests.length ? `<ul>${rests.map(([k,v]) => `<li>${escapeHtml(k)}: <b>${v} BYN</b></li>`).join('')}</ul>` : '<p class="hint">—</p>'}
                    <h4>Заказано блюд (порций):</h4>
                    ${menuCounts.length ? `<ul>${menuCounts.map(([k,v]) => `<li>${escapeHtml(k)}: <b>${v}</b></li>`).join('')}</ul>` : '<p class="hint">—</p>'}
                </div>`;
        }
    }

    global.AppView = { View, escapeHtml, formatDate, toLocalInput };

})(window);