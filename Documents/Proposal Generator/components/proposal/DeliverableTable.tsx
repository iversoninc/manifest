import React from 'react';
import { styles } from '../../styles/proposalPreview';

interface Props {
  deliverables: any[];
  calculateTotal: () => string;
  formatCost: (cost: string | number) => string;
}

export const DeliverableTable: React.FC<Props> = ({ 
  deliverables, 
  calculateTotal, 
  formatCost 
}) => (
  <div style={styles.deliverablesTable}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>DELIVERABLE</th>
          <th style={styles.th}>DESCRIPTION</th>
        </tr>
      </thead>
      <tbody>
        {deliverables.map((deliverable: any, index: number) => (
          <tr key={index}>
            <td style={styles.td}>
              <div style={styles.deliverableTitle}>{deliverable.title}</div>
              <div style={styles.deliverableCost}>{formatCost(deliverable.cost)}</div>
            </td>
            <td style={styles.td}>
              <div style={styles.deliverableDescription} dangerouslySetInnerHTML={{ 
                __html: deliverable.description.split('\n').map(line => 
                  line.trim().startsWith('•') ? 
                    `<div style="margin-bottom: 8px;">${line}</div>` : 
                    line
                ).join('<br/>') 
              }} />
            </td>
          </tr>
        ))}
        <tr>
          <td style={styles.total} colSpan={2}>
            TOTAL COST: {calculateTotal()} / MO
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
