package vn.chubebanso.icecream.domain;

public class Meta {
    private int page; //trang hiện tại
    private int pageSize; //phần tử/trang
    private int pages; //tổng sổ trang
    private int totalPage; //tổng phần tử

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }

}
