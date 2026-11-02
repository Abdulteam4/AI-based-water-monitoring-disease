import io
import csv
import json
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import WaterSample
from app.ml.dataset import PARAMETER_CONFIG

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

router = APIRouter(prefix="/reports", tags=["Report Generation"])


@router.get("/csv")
def export_csv_report(limit: int = 100, db: Session = Depends(get_db)):
    samples = db.query(WaterSample).order_by(desc(WaterSample.created_at)).limit(limit).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header row
    headers = [
        "Sample Code", "Date", "Location", "Safety Score", "Status", "Risk Level", "Potable",
        "pH", "Hardness (mg/L)", "Solids/TDS (mg/L)", "Chloramines (mg/L)", "Sulfate (mg/L)",
        "Conductivity (µS/cm)", "TOC (mg/L)", "THMs (µg/L)", "Turbidity (NTU)", "DO (mg/L)",
        "Nitrate (mg/L)", "Lead (mg/L)"
    ]
    writer.writerow(headers)
    
    for s in samples:
        writer.writerow([
            s.sample_code,
            s.created_at.strftime("%Y-%m-%d %H:%M"),
            s.location.name if s.location else "Main Water Supply",
            s.water_safety_score,
            s.status,
            s.risk_level,
            "YES" if s.is_potable else "NO",
            s.ph, s.hardness, s.solids, s.chloramines, s.sulfate,
            s.conductivity, s.organic_carbon, s.trihalomethanes, s.turbidity,
            s.dissolved_oxygen, s.nitrate, s.lead
        ])
        
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=Water_Quality_Report_{datetime.datetime.now().strftime('%Y%m%d')}.csv"}
    )


@router.get("/pdf/{sample_id}")
def generate_sample_pdf(sample_id: int, db: Session = Depends(get_db)):
    sample = db.query(WaterSample).filter(WaterSample.id == sample_id).first()
    if not sample:
        raise HTTPException(status_code=404, detail="Water sample not found.")
        
    if not REPORTLAB_AVAILABLE:
        # Fallback text/plain report if reportlab is absent
        report_text = f"""
================================================================================
            AI BASED WATER DISEASE MONITOR — OFFICIAL REPORT
================================================================================
Sample Code   : {sample.sample_code}
Generated On  : {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
Location      : {sample.location.name if sample.location else "Main Water Supply"}
Water Score   : {sample.water_safety_score} / 100
Quality Status: {sample.status}
Risk Level    : {sample.risk_level}
Is Potable    : {"YES" if sample.is_potable else "NO"}

PARAMETER MEASUREMENTS & WHO STANDARDS:
- pH Level              : {sample.ph} pH (Normal: 6.5 - 8.5)
- Turbidity             : {sample.turbidity} NTU (Normal: 0.1 - 5.0)
- Total Dissolved Solids: {sample.solids} mg/L (Normal: 100 - 500)
- Chloramines           : {sample.chloramines} mg/L (Normal: 0.5 - 4.0)
- Nitrate               : {sample.nitrate} mg/L (Normal: 0.0 - 10.0)
- Lead                  : {sample.lead} mg/L (Normal: 0.0 - 0.015)

DISCLAIMER:
This AI-generated report is intended for monitoring and decision-support only.
It does not replace certified laboratory testing or medical diagnosis.
================================================================================
"""
        return Response(content=report_text, media_type="text/plain", headers={"Content-Disposition": f"attachment; filename=Report_{sample.sample_code}.txt"})

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        alignment=1 # Center
    )
    
    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0284C7'),
        alignment=1
    )

    section_style = ParagraphStyle(
        'SecTitle',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )

    elements = []
    
    # Title Header
    elements.append(Paragraph("<b>AI BASED WATER DISEASE MONITOR</b>", title_style))
    elements.append(Paragraph("Official Environmental Health & Quality Assessment Report", subtitle_style))
    elements.append(Spacer(1, 12))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceAfter=12))
    
    # Overview Table
    status_color = colors.HexColor('#10B981') if sample.status == "SAFE" else (colors.HexColor('#F59E0B') if sample.status == "MODERATE" else colors.HexColor('#EF4444'))
    
    meta_data = [
        [Paragraph("<b>Sample Code:</b>", body_style), Paragraph(sample.sample_code, body_style),
         Paragraph("<b>Date/Time:</b>", body_style), Paragraph(sample.created_at.strftime("%Y-%m-%d %H:%M"), body_style)],
        [Paragraph("<b>Location:</b>", body_style), Paragraph(sample.location.name if sample.location else "Main Water Supply", body_style),
         Paragraph("<b>Water Score:</b>", body_style), Paragraph(f"<b>{sample.water_safety_score} / 100</b>", body_style)],
        [Paragraph("<b>Quality Status:</b>", body_style), Paragraph(f"<font color='{status_color.hexval()}'><b>{sample.status}</b></font>", body_style),
         Paragraph("<b>Risk Severity:</b>", body_style), Paragraph(f"<b>{sample.risk_level}</b>", body_style)]
    ]
    
    meta_table = Table(meta_data, colWidths=[110, 160, 110, 160])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 14))
    
    # Parameter Breakdown Table
    elements.append(Paragraph("Water Parameter Analysis vs. WHO Standard Thresholds", section_style))
    
    param_data = [["Parameter Name", "Measured Value", "WHO Safe Range", "Evaluation"]]
    params_dict = {
        "ph": (sample.ph, "pH"), "hardness": (sample.hardness, "mg/L"), "solids": (sample.solids, "mg/L"),
        "chloramines": (sample.chloramines, "mg/L"), "sulfate": (sample.sulfate, "mg/L"),
        "conductivity": (sample.conductivity, "µS/cm"), "organic_carbon": (sample.organic_carbon, "mg/L"),
        "trihalomethanes": (sample.trihalomethanes, "µg/L"), "turbidity": (sample.turbidity, "NTU"),
        "dissolved_oxygen": (sample.dissolved_oxygen, "mg/L"), "nitrate": (sample.nitrate, "mg/L"),
        "lead": (sample.lead, "mg/L")
    }
    
    for key, (val, unit) in params_dict.items():
        cfg = PARAMETER_CONFIG[key]
        safe = f"{cfg['safe_min']} - {cfg['safe_max']} {unit}"
        eval_str = "SAFE" if (cfg['safe_min'] <= val <= cfg['safe_max']) else "ANOMALOUS"
        param_data.append([cfg['name'], f"{val} {unit}", safe, eval_str])
        
    p_table = Table(param_data, colWidths=[180, 110, 140, 110])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(p_table)
    elements.append(Spacer(1, 14))
    
    # Recommendations & Health Risk Summary
    elements.append(Paragraph("Actionable Recommendations & Risk Mitigation", section_style))
    recs = json.loads(sample.recommendations_json) if sample.recommendations_json else []
    if recs:
        for r in recs[:4]:
            elements.append(Paragraph(f"• <b>[{r.get('category','Advisory')}] {r.get('action','')}:</b> {r.get('detail','')}", body_style))
            elements.append(Spacer(1, 3))
    else:
        elements.append(Paragraph("• All parameters meet standard drinking criteria. Continue regular quarterly sampling.", body_style))
        
    elements.append(Spacer(1, 14))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=10))
    
    # Professional Disclaimer
    disclaimer = "<b>PROFESSIONAL DISCLAIMER:</b> This AI-generated water quality report is produced for monitoring, decision-support, and educational risk assessment purposes. It does not constitute a certified laboratory microbiological assay or medical diagnosis. Please consult local environmental health authorities for official compliance."
    elements.append(Paragraph(disclaimer, ParagraphStyle('Disc', parent=body_style, fontSize=7.5, leading=10, textColor=colors.HexColor('#64748B'))))
    
    doc.build(elements)
    buffer.seek(0)
    
    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Water_Quality_Report_{sample.sample_code}.pdf"}
    )
