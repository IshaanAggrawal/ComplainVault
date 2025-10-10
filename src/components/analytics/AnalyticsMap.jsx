"use client";
import { MapContainer, TileLayer, Circle, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const severityStyle = (severity) => {
	switch (severity) {
		case 'high':
			return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25, radius: 18000 };
		case 'medium':
			return { color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.2, radius: 14000 };
		default:
			return { color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 0.15, radius: 10000 };
	}
};

export default function AnalyticsMap({ points = [] }) {
	const center = points[0] ? [points[0].lat, points[0].lng] : [20.5937, 78.9629]; // India center
	return (
		<div style={{ height: 520, width: '100%' }}>
			<MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{points.map((p, i) => {
					const s = severityStyle(p.severity);
					return (
						<Circle key={i} center={[p.lat, p.lng]} pathOptions={{ color: s.color, fillColor: s.fillColor, fillOpacity: s.fillOpacity }} radius={s.radius}>
							<Tooltip>{`${p.severity.toUpperCase()} • ${p.count} complaints`}</Tooltip>
							<Popup>
								<div>
									<div className="font-semibold">Area Insight</div>
									<div>Severity: {p.severity}</div>
									<div>Complaints: {p.count}</div>
								</div>
							</Popup>
						</Circle>
					);
				})}
			</MapContainer>
		</div>
	);
}


