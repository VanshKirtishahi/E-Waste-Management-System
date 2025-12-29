// src/main/java/com/ewaste/ewaste/service/PdfGenerationService.java
package com.ewaste.ewaste.service;

import com.ewaste.ewaste.model.EwasteRequest;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;

@Service
@RequiredArgsConstructor
public class PdfGenerationService {

    private final EwasteRequestRepository ewasteRequestRepository;

    // --- Font Definitions ---
    private static final Font TITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
    private static final Font HEADER_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
    private static final Font BODY_FONT = FontFactory.getFont(FontFactory.HELVETICA, 11);

    public ByteArrayInputStream generateRequestReportPdf(Long requestId, String userEmail) {
        EwasteRequest request = ewasteRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access Denied");
        }

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("E-Waste Submission Report", TITLE_FONT));
            document.add(new Paragraph("Request ID: " + request.getId(), BODY_FONT));
            document.add(new Paragraph("Status: " + request.getStatus(), BODY_FONT));
            document.add(new Paragraph("Device: " + request.getDeviceType(), BODY_FONT));
            document.add(new Paragraph("Remarks: " + (request.getRemarks() != null ? request.getRemarks() : "None"), BODY_FONT));

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generateAppreciationCertificate(User user) {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Paragraph title = new Paragraph("Certificate of Appreciation", TITLE_FONT);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("\n"));
            Paragraph name = new Paragraph("Presented to " + user.getName(), HEADER_FONT);
            name.setAlignment(Element.ALIGN_CENTER);
            document.add(name);

            document.add(new Paragraph("\nFor your commitment to recycling e-waste.", BODY_FONT));
            document.add(new Paragraph("Date: " + LocalDate.now().format(DateTimeFormatter.ISO_DATE), BODY_FONT));

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating Certificate", e);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }
}