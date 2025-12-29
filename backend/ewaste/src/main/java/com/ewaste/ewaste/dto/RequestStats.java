package com.ewaste.ewaste.dto;

import com.ewaste.ewaste.model.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestStats {
    private RequestStatus status;
    private Long count;
}