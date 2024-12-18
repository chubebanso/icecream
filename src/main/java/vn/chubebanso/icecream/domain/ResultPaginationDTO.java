package vn.chubebanso.icecream.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ResultPaginationDTO {
    private Meta meta;
    
    @JsonIgnore
    private Object result;

    public Meta getMeta() {
        return meta;
    }
    
    public void setMeta(Meta meta) {
        this.meta = meta;
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }

}
