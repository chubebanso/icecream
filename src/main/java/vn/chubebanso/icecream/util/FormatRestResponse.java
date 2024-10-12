package vn.chubebanso.icecream.util;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import jakarta.servlet.http.HttpServletResponse;
import vn.chubebanso.icecream.domain.RestResponse;

@RestControllerAdvice
public class FormatRestResponse implements ResponseBodyAdvice {

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;// chay xuong ham duoi
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
            Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        HttpServletResponse servletResponse = ((ServletServerHttpResponse) response).getServletResponse();
        int status = servletResponse.getStatus();
        vn.chubebanso.icecream.domain.RestResponse<Object> restResponse = new RestResponse<Object>();
        if (body instanceof String) {
            return body;
        }
        if (status >= 400) {
            return body;
        } else {
            restResponse.setMessage("Call Api success");
            restResponse.setData(body);
        }
        return restResponse;
    }

}
