import React from 'react';
import { useNotifications } from './NotificationProvider';
import './notifications.css';

const typeMeta: Record<string, { icon: string; color: string; accent: string }> = {
    UPDATE:   { icon: 'ℹ️',  color: '#2563eb', accent: '#3b82f6' },
    DELETE:   { icon: '⚠️',  color: '#d97706', accent: '#f59e0b' },
    ERROR:  { icon: '⛔',  color: '#dc2626', accent: '#ef4444' },
    ADD:{ icon: '✅',  color: '#0d9488', accent: '#14b8a6' },
};

export const ToastContainer: React.FC = () => {
    const { toasts, remove } = useNotifications();

    return (
        <div className="toast-container fancy">
            {toasts.map(t => {
                const dto: any = t.dto;
                const type = (dto.type || 'UPDATE').toUpperCase();
                const meta = typeMeta[type] || typeMeta.UPDATE;
                const resource = dto.entityType;
                const id = Number(dto.entityId);
                const mainMessage =
                    dto.message ||
                    [resource, id !== undefined ? `#${id}` : ''].filter(Boolean).join(' ');
                return (
                    <div
                        key={t.id}
                        className={`toast toast--large toast--${type.toLowerCase()}`}
                        style={{ ['--toast-color' as any]: meta.color, ['--toast-accent' as any]: meta.accent }}
                    >
                        <div className="toast-bar" />
                        <div className="toast-header">
                            <span className="toast-icon">{meta.icon}</span>
                            <span className="toast-title">
                                {type} {resource && `• ${resource}`}
                            </span>
                            <button
                                className="toast-close"
                                aria-label="Закрыть"
                                onClick={() => remove(t.id)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="toast-body">
                            <p className="toast-message">{mainMessage}</p>
                            <ul className="toast-details">
                                {resource && <li>Ресурс: {resource}</li>}
                                {id !== undefined && <li>ID: {id}</li>}
                                <li>Тип: {type}</li>
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
